from django.db import migrations

def update_lab_durations(apps, schema_editor):
    """Update lab course durations to reflect new splitting approach"""
    CoreCourse = apps.get_model('main', 'CoreCourse')
    
    # Update all lab courses to show they're now handled as paired blocks
    lab_courses = CoreCourse.objects.filter(is_lab=True)
    for course in lab_courses:
        course.duration = 75  # Each block is now 75 minutes
        course.save()

class Migration(migrations.Migration):
    dependencies = [
        ('main', '0001_initial'),  # Replace with your latest migration
    ]
    
    operations = [
        migrations.RunPython(update_lab_durations),
    ]
