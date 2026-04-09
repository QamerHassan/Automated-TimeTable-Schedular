from django.core.management.base import BaseCommand
from main.models import CoreCourse, Room, Section
import math

class Command(BaseCommand):
    help = 'Checks if there are enough resources (room-time slots) for all required classes.'

    def handle(self, *args, **options):
        # Define constants from your views.py
        WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        THEORY_SLOTS_PER_DAY = 9  # Based on your 8am-9pm schedule
        LAB_SLOTS_PER_DAY = 3 # Assuming labs take up 3 theory slots
        
        # 1. Calculate the total number of class sessions needed per week
        total_theory_sessions = 0
        total_lab_sessions = 0
        
        all_sections = Section.objects.all()
        for section in all_sections:
            courses = CoreCourse.objects.filter(semester_number=section.semester_number)
            for course in courses:
                if course.is_lab:
                    total_lab_sessions += 1  # Labs are once a week
                else:
                    total_theory_sessions += 2 # Theory is twice a week

        self.stdout.write(self.style.SUCCESS("--- Resource Demand Analysis ---"))
        self.stdout.write(f"Total Sections to Schedule: {all_sections.count()}")
        self.stdout.write(f"Total Weekly Theory Sessions Needed: {total_theory_sessions}")
        self.stdout.write(f"Total Weekly Lab Sessions Needed: {total_lab_sessions}")
        
        # 2. Calculate the total number of available slots per week
        theory_rooms = Room.objects.filter(core_sub=True).count()
        lab_rooms = Room.objects.filter(lab=True).count()
        
        available_theory_slots = theory_rooms * len(WEEKDAYS) * THEORY_SLOTS_PER_DAY
        available_lab_slots = lab_rooms * len(WEEKDAYS) * LAB_SLOTS_PER_DAY

        self.stdout.write(self.style.SUCCESS("\n--- Resource Supply Analysis ---"))
        self.stdout.write(f"Available Theory Rooms: {theory_rooms}")
        self.stdout.write(f"Available Lab Rooms: {lab_rooms}")
        self.stdout.write(f"Total Weekly Theory Slots Available: {available_theory_slots}")
        self.stdout.write(f"Total Weekly Lab Slots Available: {available_lab_slots}")
        
        # 3. Compare demand vs. supply
        self.stdout.write(self.style.SUCCESS("\n--- CONCLUSION ---"))
        
        theory_ratio = (total_theory_sessions / available_theory_slots * 100) if available_theory_slots > 0 else 0
        lab_ratio = (total_lab_sessions / available_lab_slots * 100) if available_lab_slots > 0 else 0

        self.stdout.write(f"Theory Slot Utilization: {theory_ratio:.2f}%")
        self.stdout.write(f"Lab Slot Utilization: {lab_ratio:.2f}%")

        if theory_ratio > 100 or lab_ratio > 100:
            self.stdout.write(self.style.ERROR("\nCRITICAL: Resource scarcity detected. There are not enough room-time slots to schedule all classes. You must add more rooms or time slots."))
        elif theory_ratio > 85 or lab_ratio > 85:
            self.stdout.write(self.style.WARNING("\nWARNING: Resource utilization is very high (>85%). The problem is highly constrained and the GA may struggle to find a solution."))
        else:
             self.stdout.write(self.style.SUCCESS("\nSUCCESS: There appear to be sufficient resources. The issue may be with the GA's ability to find the solution."))
