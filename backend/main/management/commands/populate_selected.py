import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings
from main.models import CoreCourse, Room, Section, SemesterStudents, ElectiveCourse, CohortCourse
from main.views import _pick, _to_bool, to_int_or_zero

class Command(BaseCommand):
    help = 'Populates database with data from specific Excel files only.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--files',
            nargs='+',
            help='List of Excel files to process (e.g. --files BSAI_4.2.xlsx BSCS.xlsx)',
        )
        parser.add_argument(
            '--programs',
            nargs='+',
            help='List of programs to include (e.g. --programs BSAI BSCS BSDS)',
        )

    def handle(self, *args, **options):
        data_dir = os.path.join(settings.BASE_DIR, 'data_files')
        
        # Clear existing data
        self.stdout.write("Clearing existing timetable data...")
        CoreCourse.objects.all().delete()
        Room.objects.all().delete()
        Section.objects.all().delete()
        SemesterStudents.objects.all().delete()
        ElectiveCourse.objects.all().delete()
        CohortCourse.objects.all().delete()

        # Determine which files to process
        if options['files']:
            files_to_process = options['files']
        elif options['programs']:
            # Convert program names to likely file names
            files_to_process = []
            for program in options['programs']:
                # Look for files containing the program name
                all_files = os.listdir(data_dir)
                matching_files = [f for f in all_files if program.upper() in f.upper() and f.endswith('.xlsx')]
                files_to_process.extend(matching_files)
        else:
            self.stdout.write(self.style.ERROR("Please specify either --files or --programs"))
            return

        self.stdout.write(f"Processing files: {', '.join(files_to_process)}")

        # Process each selected file
        for file_name in files_to_process:
            file_path = os.path.join(data_dir, file_name)
            if os.path.exists(file_path):
                self.stdout.write(f"Processing {file_name}...")
                try:
                    xls = pd.ExcelFile(file_path)
                    self.process_sheets(xls, file_name)
                    self.stdout.write(self.style.SUCCESS(f"✓ {file_name}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"✗ {file_name}: {e}"))
            else:
                self.stdout.write(self.style.WARNING(f"File not found: {file_name}"))

        self.stdout.write(self.style.SUCCESS(f"\nSelected files processed successfully!"))

    def process_sheets(self, xls, file_name):
        # Same processing logic as populate_all_programs
        # (Copy the process_sheets method from your existing command)
        
        # Process Students
        if "StudentCapacity" in xls.sheet_names:
            students = pd.read_excel(xls, "StudentCapacity")
            sem_col = _pick(students, "semester")
            pop_col = _pick(students, "student_count")
            for index, row in students.iterrows():
                semester = to_int_or_zero(row[sem_col])
                num_students = to_int_or_zero(row[pop_col])
                if semester > 0:
                    semester_student_obj, created = SemesterStudents.objects.get_or_create(
                        semester_number=semester,
                        defaults={'number_of_students': num_students}
                    )
                    if not created:
                        semester_student_obj.number_of_students += num_students
                        semester_student_obj.save()
                    Section.create_sections(semester, semester_student_obj.number_of_students)

        # Process Courses
        if "Roadmap" in xls.sheet_names:
            courses = pd.read_excel(xls, "Roadmap")
            sem_col = _pick(courses, "semester")
            name_col = _pick(courses, "course_name")
            lab_col = _pick(courses, "is_lab")
            for index, row in courses.iterrows():
                semester = to_int_or_zero(row[sem_col])
                if semester > 0:
                    course_name = str(row[name_col]).strip()
                    if course_name and course_name.lower() != 'nan':
                        is_lab = _to_bool(row[lab_col])
                        CoreCourse.objects.get_or_create(
                            course_name=course_name,
                            semester_number=semester,
                            defaults={'is_lab': is_lab, 'duration': 150 if is_lab else 75}
                        )

        # Process Rooms
        if "Rooms" in xls.sheet_names:
            rooms = pd.read_excel(xls, "Rooms")
            num_col = _pick(rooms, "room_name")
            type_col = _pick(rooms, "room_type", required=False)
            for _, row in rooms.iterrows():
                room_name = str(row[num_col]).strip()
                if room_name and room_name.lower() != 'nan':
                    r_type = str(row.get(type_col, "")).lower()
                    Room.objects.get_or_create(
                        room_number=room_name,
                        defaults={'core_sub': r_type in ("theory", "lecture"), 'lab': r_type == "lab"}
                    )
