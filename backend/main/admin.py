# from django.contrib import admin
# from .models import CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Timetable, Section

# @admin.register(CoreCourse)
# class CoreCourseAdmin(admin.ModelAdmin):
#     list_display = ['course_name', 'semester_number', 'is_lab', 'duration']
#     list_filter = ['semester_number', 'is_lab']
#     search_fields = ['course_name']

# @admin.register(CohortCourse)
# class CohortCourseAdmin(admin.ModelAdmin):
#     list_display = ['course_name', 'semester_number', 'student_range']
#     list_filter = ['semester_number']
#     search_fields = ['course_name']

# @admin.register(ElectiveCourse)
# class ElectiveCourseAdmin(admin.ModelAdmin):
#     list_display = ['course_name', 'semester_number', 'is_tech']
#     list_filter = ['semester_number', 'is_tech']
#     search_fields = ['course_name']

# @admin.register(Room)
# class RoomAdmin(admin.ModelAdmin):
#     list_display = ['room_number', 'core_sub', 'cohort_sub', 'lab', 'dld']
#     list_filter = ['core_sub', 'cohort_sub', 'lab', 'dld']
#     search_fields = ['room_number']

# @admin.register(SemesterStudents)
# class SemesterStudentsAdmin(admin.ModelAdmin):
#     list_display = ['semester_number', 'number_of_students']
#     list_filter = ['semester_number']

# @admin.register(Section)
# class SectionAdmin(admin.ModelAdmin):
#     list_display = ['semester_number', 'section_name', 'number_of_students']
#     list_filter = ['semester_number']
#     search_fields = ['section_name']

# @admin.register(Timetable)
# class TimetableAdmin(admin.ModelAdmin):
#     list_display = ['semester', 'created_at']
#     list_filter = ['semester', 'created_at']
#     readonly_fields = ['created_at']
from django.contrib import admin
from .models import CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Timetable, Section

@admin.register(CoreCourse)
class CoreCourseAdmin(admin.ModelAdmin):
    list_display = ['course_name', 'semester_number', 'is_lab', 'duration']
    list_filter = ['semester_number', 'is_lab']
    search_fields = ['course_name']

# In backend/main/admin.py - REPLACE with this:
class CohortCourseAdmin(admin.ModelAdmin):
    list_display = ['semester_number', 'course_name', 'capacity', 'is_lab', 'duration']
    list_filter = ['semester_number', 'is_lab']
    search_fields = ['course_name']

admin.site.register(CohortCourse, CohortCourseAdmin)


@admin.register(ElectiveCourse)
class ElectiveCourseAdmin(admin.ModelAdmin):
    list_display = ['course_name', 'semester_number', 'is_tech']
    list_filter = ['semester_number', 'is_tech']
    search_fields = ['course_name']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'core_sub', 'cohort_sub', 'lab', 'dld']
    list_filter = ['core_sub', 'cohort_sub', 'lab', 'dld']
    search_fields = ['room_number']

@admin.register(SemesterStudents)
class SemesterStudentsAdmin(admin.ModelAdmin):
    list_display = ['semester_number', 'number_of_students']
    list_filter = ['semester_number']

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ['semester_number', 'section_name', 'number_of_students']
    list_filter = ['semester_number']
    search_fields = ['section_name']

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ['semester', 'created_at']
    list_filter = ['semester', 'created_at']
    readonly_fields = ['created_at']
