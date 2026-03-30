from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import (
    User, WorkerProfile, EnterpriseProfile, CourseCategory, Course,
    VerificationTask, WorkerVerification, Job, JobApplication, Review, Message
)
from .serializers import (
    RegisterSerializer, UserSerializer, WorkerProfileSerializer,
    EnterpriseProfileSerializer, CourseCategorySerializer, CourseSerializer,
    VerificationTaskSerializer, WorkerVerificationSerializer, JobSerializer,
    JobApplicationSerializer, ReviewSerializer, MessageSerializer
)
from . import firebase_loader # Ensure admin is initialized
from firebase_admin import auth as firebase_auth

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    firebase_token = request.data.get('firebase_token')
    
    if not firebase_token:
        # Fallback to standard auth if tokens aren't provided yet
        identifier = request.data.get('phone_number') or request.data.get('username')
        password = request.data.get('password')
        
        user = None
        # Try phone number first
        try:
            user_obj = User.objects.get(phone_number=identifier)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            # Try username
            user = authenticate(username=identifier, password=password)
        
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Verify Firebase Token
        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token)
            email = decoded_token.get('email')
            # Extract pseudo phone number
            phone = email.split('@')[0] if email else ''
            user = User.objects.get(phone_number=phone)
        except Exception as e:
            return Response({"error": f"Firebase auth failed: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)
            
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user_id": user.id,
            "role": user.role,
            "username": user.username
        })
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_object(self):
        return self.request.user

class WorkerProfileViewSet(viewsets.ModelViewSet):
    queryset = WorkerProfile.objects.all()
    serializer_class = WorkerProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.role == User.Role.ADMIN:
            # Admins see everyone
            pass
        elif user.role == User.Role.ENTERPRISE:
            # Enterprises only see approved workers
            queryset = queryset.filter(verification_status=WorkerProfile.VerificationStatus.APPROVED)
        elif user.role == User.Role.WORKER:
            # Workers only see their own profile
            queryset = queryset.filter(user=user)
        else:
            queryset = queryset.none()
             
        skill = self.request.query_params.get('skill', None)
        if skill:
            queryset = queryset.filter(skills__icontains=skill)
            
        status_param = self.request.query_params.get('status', None)
        if status_param and user.role == User.Role.ADMIN:
             queryset = queryset.filter(verification_status=status_param)
             
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def verify_profile(self, request, pk=None):
        if request.user.role != User.Role.ADMIN:
            return Response({"error": "Only admins can verify profiles"}, status=status.HTTP_403_FORBIDDEN)
            
        worker_profile = self.get_object()
        verification_status = request.data.get('status')
        note = request.data.get('note', '')
        
        if verification_status not in [choice[0] for choice in WorkerProfile.VerificationStatus.choices]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            
        worker_profile.verification_status = verification_status
        worker_profile.verification_note = note
        
        if verification_status == WorkerProfile.VerificationStatus.APPROVED:
            worker_profile.is_verified = True
        else:
            worker_profile.is_verified = False
            
        worker_profile.save()
        return Response({"status": "Success", "verification_status": worker_profile.verification_status})

class EnterpriseProfileViewSet(viewsets.ModelViewSet):
    queryset = EnterpriseProfile.objects.all()
    serializer_class = EnterpriseProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Strictly return profiles where the user role is ENTERPRISE
        queryset = EnterpriseProfile.objects.filter(user__role=User.Role.ENTERPRISE)
        user = self.request.user
        if user.role == User.Role.ENTERPRISE:
            return queryset.filter(user=user)
        return queryset

class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [IsAuthenticated]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

class VerificationTaskViewSet(viewsets.ModelViewSet):
    queryset = VerificationTask.objects.all()
    serializer_class = VerificationTaskSerializer
    permission_classes = [IsAuthenticated]

class WorkerVerificationViewSet(viewsets.ModelViewSet):
    queryset = WorkerVerification.objects.all()
    serializer_class = WorkerVerificationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'worker_profile'):
            serializer.save(worker=self.request.user.worker_profile)
        
    def get_queryset(self):
        user = self.request.user
        # Admins see all submissions
        if user.role == User.Role.ADMIN:
            return WorkerVerification.objects.select_related(
                'worker__user', 'task__course'
            ).all().order_by('-submitted_at')
        # Workers only see their own
        if hasattr(user, 'worker_profile'):
            return WorkerVerification.objects.filter(worker=user.worker_profile)
        return WorkerVerification.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review_submission(self, request, pk=None):
        if request.user.role != User.Role.ADMIN:
            return Response({"error": "Only admins can review submissions"}, status=status.HTTP_403_FORBIDDEN)
        
        submission = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('admin_notes', '')
        
        valid_statuses = [s[0] for s in WorkerVerification.Status.choices]
        if new_status not in valid_statuses:
            return Response({"error": f"Invalid status. Choose from {valid_statuses}"}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.utils import timezone
        submission.status = new_status
        submission.admin_notes = notes
        submission.reviewed_at = timezone.now()
        submission.save()
        return Response({"status": "Success", "submission_status": submission.status})

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'enterprise_profile'):
            serializer.save(enterprise=self.request.user.enterprise_profile)
            
    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.WORKER and hasattr(user, 'worker_profile'):
            return JobApplication.objects.filter(worker=user.worker_profile)
        if user.role == User.Role.ENTERPRISE and hasattr(user, 'enterprise_profile'):
            return JobApplication.objects.filter(job__enterprise=user.enterprise_profile)
        return super().get_queryset()  # Admin sees all

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'worker_profile'):
            serializer.save(worker=self.request.user.worker_profile)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        worker_id = self.request.query_params.get('worker_id')

        if user.role == User.Role.ENTERPRISE:
            qs = Message.objects.filter(enterprise=user.enterprise_profile)
            if worker_id:
                qs = qs.filter(worker_id=worker_id)
            return qs

        if user.role == User.Role.WORKER:
            return Message.objects.filter(worker=user.worker_profile)

        # Admin sees all
        return Message.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == User.Role.ENTERPRISE:
            # Force enterprise to be the current user's enterprise profile
            serializer.save(
                enterprise=user.enterprise_profile,
                sender_role='ENTERPRISE'
            )
        elif user.role == User.Role.WORKER:
            # Force worker to be the current user's worker profile
            # 'enterprise' should be provided in the request data/validated_data
            serializer.save(
                worker=user.worker_profile,
                sender_role='WORKER'
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_read(self, request):
        user = self.request.user
        if user.role == User.Role.ENTERPRISE:
            worker_id = request.data.get('worker_id')
            if worker_id:
                Message.objects.filter(
                    enterprise=user.enterprise_profile,
                    worker_id=worker_id,
                    sender_role='WORKER',
                    is_read=False
                ).update(is_read=True)
                return Response({"status": "Marked as read"})
        elif user.role == User.Role.WORKER:
            enterprise_id = request.data.get('enterprise_id')
            if enterprise_id:
                Message.objects.filter(
                    worker=user.worker_profile,
                    enterprise_id=enterprise_id,
                    sender_role='ENTERPRISE',
                    is_read=False
                ).update(is_read=True)
                return Response({"status": "Marked as read"})
        return Response({"error": "Invalid request"}, status=400)
