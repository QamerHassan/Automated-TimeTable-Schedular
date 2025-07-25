from rest_framework import serializers
from .models import CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Timetable, Section

class CoreCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoreCourse
        fields = '__all__'

class CohortCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CohortCourse
        fields = '__all__'

class ElectiveCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectiveCourse
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class SemesterStudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterStudents
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class TimetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timetable
        fields = '__all__'

class TimetableGenerationSerializer(serializers.Serializer):
    max_semester = serializers.IntegerField(min_value=1, max_value=8)
    file = serializers.FileField()
