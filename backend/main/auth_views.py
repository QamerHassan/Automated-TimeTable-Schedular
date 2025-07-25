from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom user data to the response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        # Validate required fields
        if not username or not email or not password:
            return Response({
                'error': 'Username, email, and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({
                'error': 'Password validation failed',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"New user registered: {username}")
        
        return Response({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Error in register: {str(e)}", exc_info=True)
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'Account is disabled'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"User logged in: {username}")
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in login: {str(e)}", exc_info=True)
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    try:
        user = request.user
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in get_user_profile: {str(e)}", exc_info=True)
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update user profile"""
    try:
        user = request.user
        
        # Update allowed fields
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            email = request.data['email']
            # Check if email is already taken by another user
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                return Response({
                    'error': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = email
        
        user.save()
        
        logger.info(f"User profile updated: {user.username}")
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in update_user_profile: {str(e)}", exc_info=True)
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    try:
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({
                'error': 'Old password and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check old password
        if not user.check_password(old_password):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({
                'error': 'Password validation failed',
                'details': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        logger.info(f"Password changed for user: {user.username}")
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in change_password: {str(e)}", exc_info=True)
        return Response({
            'error': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
