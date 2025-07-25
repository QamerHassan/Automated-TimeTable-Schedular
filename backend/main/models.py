from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
import math


class CoreCourse(models.Model):
    semester_number = models.IntegerField()
    course_name = models.CharField(max_length=200)
    is_lab = models.BooleanField()
    duration = models.IntegerField(default=75)  # Duration in minutes, default to 75 for theory classes

    def __str__(self):
        return f"{self.course_name} ({'Lab' if self.is_lab else 'Theory'})"


class CohortCourse(models.Model):
    course_name = models.CharField(max_length=200)
    semester_number = models.IntegerField()
    student_range = models.IntegerField()

    def __str__(self):
        return f"{self.course_name} (Semester {self.semester_number})"


class ElectiveCourse(models.Model):
    semester_number = models.IntegerField()
    course_name = models.CharField(max_length=200)
    is_tech = models.BooleanField()

    def __str__(self):
        return f"{self.course_name} ({'Tech' if self.is_tech else 'Uni'} Elective)"


class Room(models.Model):
    room_number = models.CharField(max_length=50, default="Unknown")
    core_sub = models.BooleanField(default=False)
    cohort_sub = models.BooleanField(default=False)
    lab = models.BooleanField(default=False)
    dld = models.BooleanField(default=False)

    def __str__(self):
        return f"Room {self.room_number}"


class SemesterStudents(models.Model):
    semester_number = models.IntegerField()
    number_of_students = models.IntegerField()

    def __str__(self):
        return f"Semester {self.semester_number}: {self.number_of_students} students"


class Section(models.Model):
    semester_number = models.IntegerField()
    section_name = models.CharField(max_length=10)  # A1, A2, etc.
    number_of_students = models.IntegerField()

    def __str__(self):
        return f"Semester {self.semester_number} - Section {self.section_name}"

    @classmethod
    def create_sections(cls, semester_number, total_students, students_per_section=50):
        # Delete existing sections for this semester
        cls.objects.filter(semester_number=semester_number).delete()
        
        # Calculate number of sections needed
        num_sections = math.ceil(total_students / students_per_section)
        
        # Create sections
        sections = []
        remaining_students = total_students
        
        for i in range(num_sections):
            section_name = f"A{i+1}"
            students_in_section = min(students_per_section, remaining_students)
            
            section = cls.objects.create(
                semester_number=semester_number,
                section_name=section_name,
                number_of_students=students_in_section
            )
            sections.append(section)
            remaining_students -= students_in_section
        
        return sections


class Timetable(models.Model):
    semester = models.IntegerField()
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Timetable for Semester {self.semester}"


# NEW ENHANCED MODELS FOR IMPROVED SCHEDULING

class EnhancedSchedule(models.Model):
    semester = models.IntegerField()
    section = models.CharField(max_length=10)  # A1, A2, etc.
    subject = models.CharField(max_length=200)
    is_lab = models.BooleanField(default=False)
    time_slot = models.CharField(max_length=20)  # e.g., "8:00-9:15"
    day = models.CharField(max_length=10)  # Monday, Tuesday, etc.
    room = models.CharField(max_length=50)
    teacher = models.CharField(max_length=200, null=True, blank=True)
    week_number = models.IntegerField(default=1)  # For tracking weekly occurrences
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sem {self.semester} - {self.section}: {self.subject} ({self.day} {self.time_slot})"


class GlobalScheduleMatrix(models.Model):
    time_slot = models.CharField(max_length=20)  # e.g., "8:00-9:15"
    day = models.CharField(max_length=10)  # Monday, Tuesday, etc.
    room_number = models.CharField(max_length=50)
    semester = models.IntegerField()
    section = models.CharField(max_length=10)
    subject = models.CharField(max_length=200)
    teacher = models.CharField(max_length=200, null=True, blank=True)
    is_occupied = models.BooleanField(default=True)

    class Meta:
        unique_together = ('time_slot', 'day', 'room_number')

    def __str__(self):
        return f"{self.day} {self.time_slot} - Room {self.room_number}"


class SubjectFrequencyRule(models.Model):
    course_name = models.CharField(max_length=200)
    is_lab = models.BooleanField()
    frequency_per_week = models.IntegerField()  # 2 for theoretical, 1 for labs
    semester_number = models.IntegerField()

    def __str__(self):
        return f"{self.course_name}: {self.frequency_per_week}x per week"

    @classmethod
    def populate_default_rules(cls):
        """Populate default frequency rules for subjects"""
        # Clear existing rules
        cls.objects.all().delete()
        
        # Get all theoretical courses (non-lab)
        theoretical_courses = CoreCourse.objects.filter(is_lab=False)
        for course in theoretical_courses:
            cls.objects.create(
                course_name=course.course_name,
                is_lab=False,
                frequency_per_week=2,  # Theoretical subjects: twice per week
                semester_number=course.semester_number
            )
        
        # Get all lab courses
        lab_courses = CoreCourse.objects.filter(is_lab=True)
        for course in lab_courses:
            cls.objects.create(
                course_name=course.course_name,
                is_lab=True,
                frequency_per_week=1,  # Lab subjects: once per week
                semester_number=course.semester_number
            )


class TimeSlotConfiguration(models.Model):
    slot_name = models.CharField(max_length=20)  # e.g., "Morning Block 1"
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=1)  # 1=highest priority
    
    class Meta:
        ordering = ['priority', 'start_time']

    def __str__(self):
        return f"{self.slot_name}: {self.start_time} - {self.end_time}"

    @classmethod
    def create_default_slots(cls):
        """Create default time slots from 8 AM to 9 PM"""
        cls.objects.all().delete()  # Clear existing slots
        
        time_slots = [
            # Morning Block
            ("Morning 1", "08:00:00", "09:15:00", 1),
            ("Morning 2", "09:30:00", "10:45:00", 2),
            ("Morning 3", "11:00:00", "12:15:00", 3),
            
            # Afternoon Block
            ("Afternoon 1", "12:30:00", "13:45:00", 4),
            ("Afternoon 2", "14:00:00", "15:15:00", 5),
            ("Afternoon 3", "15:30:00", "16:45:00", 6),
            
            # Evening Block
            ("Evening 1", "17:00:00", "18:15:00", 7),
            ("Evening 2", "18:30:00", "19:45:00", 8),
            ("Evening 3", "20:00:00", "21:15:00", 9),
        ]
        
        for slot_name, start, end, priority in time_slots:
            cls.objects.create(
                slot_name=slot_name,
                start_time=start,
                end_time=end,
                priority=priority
            )


class SchedulingConstraint(models.Model):
    constraint_name = models.CharField(max_length=200)
    constraint_type = models.CharField(max_length=50)  # 'hard' or 'soft'
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    weight = models.IntegerField(default=1)  # For soft constraints

    def __str__(self):
        return f"{self.constraint_name} ({self.constraint_type})"
