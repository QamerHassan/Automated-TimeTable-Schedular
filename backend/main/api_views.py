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


###########################################################################################################################################


# from rest_framework import status
# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from django.http import HttpResponse, JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.views import View
# from django.utils.decorators import method_decorator
# from .models import Timetable, CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, Section
# from .serializers import TimetableSerializer, TimetableGenerationSerializer
# from .views import process_excel_file, create_timetable, download_timetable_excel, ENHANCED_TIME_SLOTS, WEEKDAYS
# import logging
# import json
# from io import BytesIO
# import base64

# logger = logging.getLogger(__name__)

# def ensure_complete_schedule_data(schedule_data):
#     """Ensure all time slots are present for consistent display"""
#     all_display_slots = [slot.replace('-', ' - ') for slot in ENHANCED_TIME_SLOTS]
    
#     for section_key in schedule_data:
#         for day in WEEKDAYS:
#             if day not in schedule_data[section_key]:
#                 schedule_data[section_key][day] = {}
#             for slot in all_display_slots:
#                 if slot not in schedule_data[section_key][day]:
#                     schedule_data[section_key][day][slot] = "Free"
    
#     return schedule_data

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
            
#             # Generate timetable using genetic algorithm
#             timetable_data = create_timetable(max_semester)
            
#             if not timetable_data:
#                 return Response(
#                     {'error': 'Failed to generate timetable. No course data found.'}, 
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
            
#             # Ensure complete schedule data
#             timetable_data = ensure_complete_schedule_data(timetable_data)
            
#             # Auto-save the generated timetable
#             try:
#                 timetable = Timetable.objects.create(
#                     semester=max_semester,
#                     data=timetable_data
#                 )
#                 logger.info(f"Timetable automatically saved with ID: {timetable.id}")
#             except Exception as save_error:
#                 logger.warning(f"Failed to auto-save timetable: {save_error}")
            
#             return Response({
#                 'success': True,
#                 'max_semester': max_semester,
#                 'data': timetable_data,  # Changed from 'timetable_data' to 'data' to match frontend expectation
#                 'message': 'Timetable generated successfully using Genetic Algorithm',
#                 'timetable_id': timetable.id if 'timetable' in locals() else None
#             }, status=status.HTTP_200_OK)
            
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
#     except Exception as e:
#         logger.error(f"Error in generate_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @csrf_exempt
# @require_http_methods(["POST"])
# def api_generate_timetable(request):
#     """
#     API endpoint for timetable generation (matches frontend expectation)
#     Accepts both JSON and multipart form data
#     """
#     try:
#         # Parse request data
#         if request.content_type and 'application/json' in request.content_type:
#             data = json.loads(request.body)
#             max_semester = data.get('max_semester')
#             file_data = data.get('file_data')  # Base64 encoded file data
#             file_name = data.get('file_name', 'uploaded_file.xlsx')
#         else:
#             # Handle multipart form data
#             max_semester = request.POST.get('max_semester')
#             uploaded_file = request.FILES.get('file')
            
#             if not uploaded_file:
#                 return JsonResponse({
#                     'success': False,
#                     'error': 'No file uploaded'
#                 }, status=400)
        
#         if not max_semester:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'max_semester is required'
#             }, status=400)
        
#         max_semester = int(max_semester)
        
#         # Process the uploaded file
#         if request.content_type and 'application/json' in request.content_type:
#             # Handle base64 file data
#             file_content = base64.b64decode(file_data)
#             file_obj = BytesIO(file_content)
#             file_obj.name = file_name
#             success = process_excel_file(file_obj)
#         else:
#             # Handle direct file upload
#             success = process_excel_file(uploaded_file)
        
#         if not success:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'Failed to process the uploaded file'
#             }, status=400)
        
#         # Generate timetable using the genetic algorithm
#         timetable_data = create_timetable(max_semester)
        
#         if not timetable_data:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'Failed to generate timetable. No course data found.'
#             }, status=400)
        
#         # Ensure complete schedule data for frontend display
#         timetable_data = ensure_complete_schedule_data(timetable_data)
        
#         # Save timetable to database automatically
#         try:
#             timetable = Timetable.objects.create(
#                 semester=max_semester,
#                 data=timetable_data
#             )
#             logger.info(f"Timetable automatically saved with ID: {timetable.id}")
#         except Exception as save_error:
#             logger.warning(f"Failed to auto-save timetable: {save_error}")
        
#         return JsonResponse({
#             'success': True,
#             'message': 'Timetable generated successfully using Genetic Algorithm',
#             'data': timetable_data,
#             'max_semester': max_semester,
#             'timetable_id': timetable.id if 'timetable' in locals() else None
#         })
        
#     except ValueError as e:
#         logger.error(f"ValueError in api_generate_timetable: {str(e)}")
#         return JsonResponse({
#             'success': False,
#             'error': f'Invalid input: {str(e)}'
#         }, status=400)
    
#     except Exception as e:
#         logger.error(f"Error in api_generate_timetable: {str(e)}", exc_info=True)
#         return JsonResponse({
#             'success': False,
#             'error': f'Internal server error: {str(e)}'
#         }, status=500)

# @api_view(['POST'])
# def save_timetable_api(request):
#     """API endpoint to save timetable"""
#     try:
#         max_semester = request.data.get('max_semester')
#         timetable_data = request.data.get('timetable_data') or request.data.get('data')  # Accept both keys
        
#         logger.info(f"Received save request - max_semester: {max_semester}, data keys: {list(timetable_data.keys()) if timetable_data else 'None'}")
        
#         # If timetable_data is not provided in request, check session data
#         if not timetable_data:
#             # Check for enhanced timetable in session (from genetic algorithm)
#             temp_enhanced = request.session.get('temp_enhanced_timetable')
#             temp_original = request.session.get('temp_timetable')
            
#             if temp_enhanced:
#                 max_semester = max_semester or temp_enhanced.get('max_semester')
#                 timetable_data = temp_enhanced.get('data')
#                 logger.info(f"Using enhanced timetable from session - max_semester: {max_semester}")
#             elif temp_original:
#                 max_semester = max_semester or temp_original.get('max_semester')
#                 timetable_data = temp_original.get('data')
#                 logger.info(f"Using original timetable from session - max_semester: {max_semester}")
        
#         if not max_semester or not timetable_data:
#             return Response(
#                 {'error': 'max_semester and timetable_data are required'}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Ensure complete schedule data
#         timetable_data = ensure_complete_schedule_data(timetable_data)
        
#         timetable = Timetable.objects.create(
#             semester=max_semester,
#             data=timetable_data
#         )
        
#         # Clear session data after successful save
#         if 'temp_enhanced_timetable' in request.session:
#             del request.session['temp_enhanced_timetable']
#         if 'temp_timetable' in request.session:
#             del request.session['temp_timetable']
        
#         serializer = TimetableSerializer(timetable)
#         logger.info(f"Timetable saved successfully with ID: {timetable.id}")
        
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

# @csrf_exempt
# @require_http_methods(["POST"])
# def api_save_timetable(request):
#     """
#     API endpoint to save timetable data (JSON-based)
#     """
#     try:
#         data = json.loads(request.body)
#         max_semester = data.get('max_semester')
#         timetable_data = data.get('data') or data.get('timetable_data')
        
#         if not max_semester or not timetable_data:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'max_semester and data are required'
#             }, status=400)
        
#         logger.info(f"Received save request - max_semester: {max_semester}, data keys: {list(timetable_data.keys())}")
        
#         # Ensure complete schedule data
#         timetable_data = ensure_complete_schedule_data(timetable_data)
        
#         # Save timetable to database
#         timetable = Timetable.objects.create(
#             semester=max_semester,
#             data=timetable_data
#         )
        
#         logger.info(f"Timetable saved successfully with ID: {timetable.id}")
        
#         return JsonResponse({
#             'success': True,
#             'message': 'Timetable saved successfully',
#             'timetable_id': timetable.id
#         })
        
#     except Exception as e:
#         logger.error(f"Error in api_save_timetable: {str(e)}", exc_info=True)
#         return JsonResponse({
#             'success': False,
#             'error': f'Internal server error: {str(e)}'
#         }, status=500)

# @api_view(['GET'])
# def get_timetables_api(request):
#     """API endpoint to get all timetables"""
#     try:
#         timetables = Timetable.objects.all().order_by('-created_at')
#         serializer = TimetableSerializer(timetables, many=True)
        
#         # Ensure all timetables have complete schedule data
#         for timetable_data in serializer.data:
#             if 'data' in timetable_data and timetable_data['data']:
#                 timetable_data['data'] = ensure_complete_schedule_data(timetable_data['data'])
        
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

# @csrf_exempt
# @require_http_methods(["GET"])
# def api_get_timetables(request):
#     """
#     API endpoint to get all saved timetables (JSON-based)
#     """
#     try:
#         timetables = Timetable.objects.all().order_by('-created_at')
        
#         timetables_data = []
#         for timetable in timetables:
#             # Ensure complete schedule data
#             complete_data = ensure_complete_schedule_data(timetable.data) if timetable.data else {}
            
#             timetables_data.append({
#                 'id': timetable.id,
#                 'semester': timetable.semester,
#                 'created_at': timetable.created_at.isoformat(),
#                 'data': complete_data
#             })
        
#         return JsonResponse({
#             'success': True,
#             'timetables': timetables_data
#         })
        
#     except Exception as e:
#         logger.error(f"Error in api_get_timetables: {str(e)}", exc_info=True)
#         return JsonResponse({
#             'success': False,
#             'error': f'Internal server error: {str(e)}'
#         }, status=500)

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

# @csrf_exempt
# @require_http_methods(["DELETE"])
# def api_delete_timetable(request, timetable_id):
#     """
#     API endpoint to delete a specific timetable (JSON-based)
#     """
#     try:
#         timetable = Timetable.objects.get(id=timetable_id)
#         timetable.delete()
        
#         return JsonResponse({
#             'success': True,
#             'message': 'Timetable deleted successfully'
#         })
        
#     except Timetable.DoesNotExist:
#         return JsonResponse({
#             'success': False,
#             'error': 'Timetable not found'
#         }, status=404)
    
#     except Exception as e:
#         logger.error(f"Error in api_delete_timetable: {str(e)}", exc_info=True)
#         return JsonResponse({
#             'success': False,
#             'error': f'Internal server error: {str(e)}'
#         }, status=500)

# @csrf_exempt
# @require_http_methods(["GET"])
# def api_get_timetable(request, timetable_id):
#     """
#     API endpoint to get a specific timetable
#     """
#     try:
#         timetable = Timetable.objects.get(id=timetable_id)
        
#         # Ensure complete schedule data
#         complete_data = ensure_complete_schedule_data(timetable.data) if timetable.data else {}
        
#         return JsonResponse({
#             'success': True,
#             'timetable': {
#                 'id': timetable.id,
#                 'semester': timetable.semester,
#                 'created_at': timetable.created_at.isoformat(),
#                 'data': complete_data
#             }
#         })
        
#     except Timetable.DoesNotExist:
#         return JsonResponse({
#             'success': False,
#             'error': 'Timetable not found'
#         }, status=404)
    
#     except Exception as e:
#         logger.error(f"Error in api_get_timetable: {str(e)}", exc_info=True)
#         return JsonResponse({
#             'success': False,
#             'error': f'Internal server error: {str(e)}'
#         }, status=500)

# @api_view(['GET'])
# def download_timetable_api(request, timetable_id):
#     """API endpoint to download timetable as Excel"""
#     try:
#         return download_timetable_excel(request, timetable_id)
        
#     except Exception as e:
#         logger.error(f"Error in download_timetable_api: {str(e)}", exc_info=True)
#         return Response(
#             {'error': f'Internal server error: {str(e)}'}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# # Class-based view for handling file uploads (used for batch processing)
# @method_decorator(csrf_exempt, name='dispatch')
# class FileUploadView(View):
#     def post(self, request):
#         try:
#             uploaded_file = request.FILES.get('file')
#             max_semester = request.POST.get('max_semester')
            
#             if not uploaded_file:
#                 return JsonResponse({
#                     'success': False,
#                     'error': 'File is required'
#                 }, status=400)
            
#             # Process file
#             success = process_excel_file(uploaded_file)
            
#             if success:
#                 return JsonResponse({
#                     'success': True,
#                     'message': 'File processed successfully'
#                 })
#             else:
#                 return JsonResponse({
#                     'success': False,
#                     'error': 'Failed to process file'
#                 }, status=400)
                
#         except Exception as e:
#             logger.error(f"Error in FileUploadView: {str(e)}", exc_info=True)
#             return JsonResponse({
#                 'success': False,
#                 'error': f'Internal server error: {str(e)}'
#             }, status=500)




