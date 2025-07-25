from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, api_views, auth_views

urlpatterns = [
    # Web views (original ones maintained)
    path('', views.home, name='home'),
    path('generate/', views.generate_timetable, name='generate_timetable'),
    path('save/', views.save_timetable, name='save_timetable'),
    path('view/', views.view_timetable, name='view_timetable'),
    path('download/<int:timetable_id>/', views.download_timetable_excel, name='download_timetable_excel'),
    path('delete/<int:timetable_id>/', views.delete_timetable, name='delete_timetable'),
    
    # NEW ENHANCED GENETIC ALGORITHM ROUTES
    path('generate-enhanced/', views.generate_enhanced_timetable, name='generate_enhanced_timetable'),
    # REMOVED: path('generate-original/', views.generate_original_timetable, name='generate_original_timetable'),
    path('generate-enhanced-web/', views.generate_enhanced_web, name='generate_enhanced_web'),
    path('validate-enhanced/', views.validate_enhanced_schedule, name='validate_enhanced_schedule'),
    path('schedule-stats/', views.get_schedule_statistics, name='get_schedule_statistics'),
    
    # API endpoints (original ones maintained)
    path('api/generate/', api_views.generate_timetable_api, name='generate_timetable_api'),
    path('api/save/', api_views.save_timetable_api, name='save_timetable_api'),
    path('api/timetables/', api_views.get_timetables_api, name='get_timetables_api'),
    path('api/timetables/<int:timetable_id>/delete/', api_views.delete_timetable_api, name='delete_timetable_api'),
    path('api/timetables/<int:timetable_id>/download/', api_views.download_timetable_api, name='download_timetable_api'),
    
    # NEW ENHANCED API ENDPOINTS
    path('api/generate-enhanced/', views.generate_enhanced_timetable, name='generate_enhanced_timetable_api'),
    path('api/validate-enhanced/', views.validate_enhanced_schedule, name='validate_enhanced_schedule_api'),
    path('api/schedule-stats/', views.get_schedule_statistics, name='get_schedule_statistics_api'),
    
    # Auth endpoints (maintained)
    path('api/auth/register/', auth_views.register, name='register'),
    path('api/auth/login/', auth_views.login, name='login'),
    path('api/auth/token/', auth_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', auth_views.get_user_profile, name='get_user_profile'),
    path('api/auth/profile/update/', auth_views.update_user_profile, name='update_user_profile'),
    path('api/auth/change-password/', auth_views.change_password, name='change_password'),
]


