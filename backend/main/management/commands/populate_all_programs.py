import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.conf import settings
from main.models import CoreCourse, Room, Section, SemesterStudents, ElectiveCourse, CohortCourse
# We are re-using the helper functions from your views.py, so make sure they exist there.
from main.views import _pick, _to_bool 

# --- NEW HELPER FUNCTION TO HANDLE 'nil' and INVALID NUMBERS ---
def to_int_or_zero(value):
    """
    Safely converts a value to an integer. If the value is invalid
    (like 'nil', empty, or NaN), it returns 0.
    """
    try:
        # Handle pandas Not a Number (NaN) which appears for empty cells
        if pd.isna(value):
            return 0
        # Use float first to handle cases like "1.0", then convert to int
        return int(float(value))
    except (ValueError, TypeError):
        # This will catch 'nil' and other non-numeric text, returning 0 instead
        return 0

class Command(BaseCommand):
    help = 'Populates the database with data from all program Excel files, treating "nil" as 0.'

    def handle(self, *args, **options):
        # --- 1. DEFINE THE DATA DIRECTORY ---
        data_dir = os.path.join(settings.BASE_DIR, 'data_files')
        if not os.path.isdir(data_dir):
            self.stdout.write(self.style.ERROR(f"Data directory not found. Please create it: {data_dir}"))
            return

        # --- 2. CLEAR ALL EXISTING DATA (ONCE) ---
        self.stdout.write("Clearing existing timetable data...")
        CoreCourse.objects.all().delete()
        Room.objects.all().delete()
        Section.objects.all().delete()
        SemesterStudents.objects.all().delete()
        ElectiveCourse.objects.all().delete()
        CohortCourse.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        # --- 3. FIND AND PROCESS EACH EXCEL FILE ---
        excel_files = [f for f in os.listdir(data_dir) if f.endswith('.xlsx')]
        if not excel_files:
            self.stdout.write(self.style.WARNING("No .xlsx files found in the data directory."))
            return

        self.stdout.write(f"Found {len(excel_files)} files to process: {', '.join(excel_files)}")

        for file_name in excel_files:
            self.stdout.write(f"\n--- Processing file: {file_name} ---")
            file_path = os.path.join(data_dir, file_name)
            try:
                xls = pd.ExcelFile(file_path)
                self.process_sheets(xls, file_name)
                self.stdout.write(self.style.SUCCESS(f"Successfully processed {file_name}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to process {file_name}. Error: {e}"))
        
        self.stdout.write(self.style.SUCCESS("\nAll files processed. Database population complete."))

    # =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT METHOD ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
    def process_sheets(self, xls, file_name_for_logging):
        # This function processes sheets from a single file and appends the data
        
        # --- Process Students and CREATE SECTIONS ---
        if "StudentCapacity" in xls.sheet_names:
            students = pd.read_excel(xls, "StudentCapacity")
            sem_col  = _pick(students, "semester")
            pop_col  = _pick(students, "student_count")
            for index, row in students.iterrows():
                semester = to_int_or_zero(row[sem_col])
                num_students = to_int_or_zero(row[pop_col])

                if semester == 0:
                    self.stdout.write(self.style.WARNING(f"  -> Skipping row #{index+2} in StudentCapacity (Semester is 0/nil) in {file_name_for_logging}"))
                    continue
                
                # --- ADDED THIS BLOCK TO CREATE SECTIONS ---
                # First, check if a SemesterStudents object exists for this semester
                # to avoid creating sections for programs not fully defined.
                semester_student_obj, created = SemesterStudents.objects.get_or_create(
                    semester_number=semester,
                    defaults={'number_of_students': num_students}
                )
                if not created:
                    # If it already exists, add the new students to the total
                    semester_student_obj.number_of_students += num_students
                    semester_student_obj.save()
                
                # Now, create/update sections for this semester with the total student count
                Section.create_sections(semester, semester_student_obj.number_of_students)
                # --- END OF ADDED BLOCK ---

        # --- Process Courses (from Roadmap) ---
        if "Roadmap" in xls.sheet_names:
            courses = pd.read_excel(xls, "Roadmap")
            sem_col   = _pick(courses, "semester")
            name_col  = _pick(courses, "course_name")
            lab_col   = _pick(courses, "is_lab")
            for index, row in courses.iterrows():
                semester = to_int_or_zero(row[sem_col])
                course_name = str(row[name_col]).strip()

                if semester == 0 or not course_name or course_name.lower() == 'nan':
                    self.stdout.write(self.style.WARNING(f"  -> Skipping row #{index+2} in Roadmap (Invalid semester/name) in {file_name_for_logging}"))
                    continue

                is_lab = _to_bool(row[lab_col])
                CoreCourse.objects.get_or_create(
                    course_name=course_name,
                    semester_number=semester,
                    defaults={'is_lab': is_lab, 'duration': 150 if is_lab else 75}
                )

        # --- Process Rooms ---
        if "Rooms" in xls.sheet_names:
            rooms = pd.read_excel(xls, "Rooms")
            num_col = _pick(rooms, "room_name")
            type_col = _pick(rooms, "room_type", required=False)
            for _, row in rooms.iterrows():
                room_name = str(row[num_col]).strip()
                if not room_name or room_name.lower() == 'nan': continue
                r_type = str(row.get(type_col, "")).lower()
                Room.objects.get_or_create(
                    room_number=room_name,
                    defaults={'core_sub': r_type in ("theory", "lecture"), 'lab': r_type == "lab"}
                )

