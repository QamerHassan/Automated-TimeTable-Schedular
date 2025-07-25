# Generated manually for enhanced scheduling models

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),  # Change this to your latest migration number
    ]

    operations = [
        migrations.CreateModel(
            name='EnhancedSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semester', models.IntegerField()),
                ('section', models.CharField(max_length=10)),
                ('subject', models.CharField(max_length=200)),
                ('is_lab', models.BooleanField(default=False)),
                ('time_slot', models.CharField(max_length=20)),
                ('day', models.CharField(max_length=10)),
                ('room', models.CharField(max_length=50)),
                ('teacher', models.CharField(blank=True, max_length=200, null=True)),
                ('week_number', models.IntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='GlobalScheduleMatrix',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_slot', models.CharField(max_length=20)),
                ('day', models.CharField(max_length=10)),
                ('room_number', models.CharField(max_length=50)),
                ('semester', models.IntegerField()),
                ('section', models.CharField(max_length=10)),
                ('subject', models.CharField(max_length=200)),
                ('teacher', models.CharField(blank=True, max_length=200, null=True)),
                ('is_occupied', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='SubjectFrequencyRule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_name', models.CharField(max_length=200)),
                ('is_lab', models.BooleanField()),
                ('frequency_per_week', models.IntegerField()),
                ('semester_number', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='TimeSlotConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slot_name', models.CharField(max_length=20)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('is_active', models.BooleanField(default=True)),
                ('priority', models.IntegerField(default=1)),
            ],
            options={
                'ordering': ['priority', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='SchedulingConstraint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('constraint_name', models.CharField(max_length=200)),
                ('constraint_type', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('is_active', models.BooleanField(default=True)),
                ('weight', models.IntegerField(default=1)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='globalschedulematrix',
            unique_together={('time_slot', 'day', 'room_number')},
        ),
    ]
