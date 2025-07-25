# from rest_framework import status
# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from django.http import HttpResponse
# from .models import Timetable, CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Section
# from .serializers import TimetableSerializer, TimetableGenerationSerializer
# from .views import process_excel_file, create_timetable
# import logging

# logger = logging.getLogger(__name__)

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser])
# def generate_timetable_api(request):
#     """API endpoint to generate timetable"""
#     try:
#         serializer = TimetableGenerationSerializer(data=request.data)
#         if serializer.is_valid():
#             max_semester = serializer.validated_data['max_semester']
#             file = serializer.validated_data['file']
            
#             # Process the uploaded file
#             if file.name.endswith('.xlsx') or file.name.endswith('.xls'):
#                 success = process_excel_file(file)
#             else:
#                 return Response(
#                     {'error': 'Only Excel files (.xlsx, .xls) are supported'}, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
            
#             if not success:
#                 return Response(
#                     {'error': 'Error processing the uploaded file'}, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
            
#             # Generate timetable
#             timetable_data = create_timetable(max_semester)
            
#             return Response({
#                 'success': True,
#                 'max_semester': max_semester,
#                 'timetable_data': timetable_data,
#                 'message': 'Timetable generated successfully'
#             }, status=status.HTTP_200_OK)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     except Exception as e:
#         logger.error(f"Error in generate_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['POST'])
# def save_timetable_api(request):
#     """API endpoint to save timetable"""
#     try:
#         max_semester = request.data.get('max_semester')
#         timetable_data = request.data.get('timetable_data')
        
#         if not max_semester or not timetable_data:
#             return Response(
#                 {'error': 'max_semester and timetable_data are required'}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         timetable = Timetable.objects.create(
#             semester=max_semester,
#             data=timetable_data
#         )
        
#         serializer = TimetableSerializer(timetable)
#         return Response({
#             'success': True,
#             'timetable': serializer.data,
#             'message': 'Timetable saved successfully'
#         }, status=status.HTTP_201_CREATED)
    
#     except Exception as e:
#         logger.error(f"Error in save_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['GET'])
# def get_timetables_api(request):
#     """API endpoint to get all timetables"""
#     try:
#         timetables = Timetable.objects.all().order_by('-created_at')
#         serializer = TimetableSerializer(timetables, many=True)
#         return Response({
#             'success': True,
#             'timetables': serializer.data
#         }, status=status.HTTP_200_OK)
    
#     except Exception as e:
#         logger.error(f"Error in get_timetables_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['DELETE'])
# def delete_timetable_api(request, timetable_id):
#     """API endpoint to delete a timetable"""
#     try:
#         timetable = Timetable.objects.get(id=timetable_id)
#         timetable.delete()
#         return Response({
#             'success': True,
#             'message': 'Timetable deleted successfully'
#         }, status=status.HTTP_200_OK)
    
#     except Timetable.DoesNotExist:
#         return Response(
#             {'error': 'Timetable not found'}, 
#             status=status.HTTP_404_NOT_FOUND
#         )
#     except Exception as e:
#         logger.error(f"Error in delete_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['GET'])
# def download_timetable_api(request, timetable_id):
#     """API endpoint to download timetable as Excel"""
#     try:
#         from .views import download_timetable_excel
#         return download_timetable_excel(request, timetable_id)
    
#     except Exception as e:
#         logger.error(f"Error in download_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Timetable, CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Section
from .serializers import TimetableSerializer, TimetableGenerationSerializer
from .views import process_excel_file, create_timetable
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def generate_timetable_api(request):
    """API endpoint to generate timetable"""
    try:
        serializer = TimetableGenerationSerializer(data=request.data)
        if serializer.is_valid():
            max_semester = serializer.validated_data['max_semester']
            file = serializer.validated_data['file']
            
            # Process the uploaded file
            if file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                success = process_excel_file(file)
            else:
                return Response(
                    {'error': 'Only Excel files (.xlsx, .xls) are supported'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not success:
                return Response(
                    {'error': 'Error processing the uploaded file'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate timetable
            timetable_data = create_timetable(max_semester)
            
            return Response({
                'success': True,
                'max_semester': max_semester,
                'timetable_data': timetable_data,
                'message': 'Timetable generated successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error in generate_timetable_api: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Internal server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def save_timetable_api(request):
    """API endpoint to save timetable"""
    try:
        max_semester = request.data.get('max_semester')
        timetable_data = request.data.get('timetable_data')
        
        logger.info(f"Received save request - max_semester: {max_semester}, data keys: {list(timetable_data.keys()) if timetable_data else 'None'}")
        
        if not max_semester or not timetable_data:
            return Response(
                {'error': 'max_semester and timetable_data are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        timetable = Timetable.objects.create(
            semester=max_semester,
            data=timetable_data
        )
        
        serializer = TimetableSerializer(timetable)
        logger.info(f"Timetable saved successfully with ID: {timetable.id}")
        
        return Response({
            'success': True,
            'timetable': serializer.data,
            'message': 'Timetable saved successfully'
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Error in save_timetable_api: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Internal server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_timetables_api(request):
    """API endpoint to get all timetables"""
    try:
        timetables = Timetable.objects.all().order_by('-created_at')
        serializer = TimetableSerializer(timetables, many=True)
        return Response({
            'success': True,
            'timetables': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in get_timetables_api: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Internal server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
def delete_timetable_api(request, timetable_id):
    """API endpoint to delete a timetable"""
    try:
        timetable = Timetable.objects.get(id=timetable_id)
        timetable.delete()
        return Response({
            'success': True,
            'message': 'Timetable deleted successfully'
        }, status=status.HTTP_200_OK)
    
    except Timetable.DoesNotExist:
        return Response(
            {'error': 'Timetable not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error in delete_timetable_api: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Internal server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def download_timetable_api(request, timetable_id):
    """API endpoint to download timetable as Excel"""
    try:
        from .views import download_timetable_excel
        return download_timetable_excel(request, timetable_id)
    
    except Exception as e:
        logger.error(f"Error in download_timetable_api: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Internal server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
