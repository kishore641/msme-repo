from rest_framework import serializers
from .models import (
    User, WorkerProfile, EnterpriseProfile, CourseCategory, Course,
    VerificationTask, WorkerVerification, Job, JobApplication, Review, Message
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number', 'role', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    location = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'phone_number', 'password', 'role', 'first_name', 'last_name', 'location']
        
    def create(self, validated_data):
        location = validated_data.pop('location', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            phone_number=validated_data.get('phone_number', ''),
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        if user.role == User.Role.WORKER:
            WorkerProfile.objects.create(user=user, location=location)
        elif user.role == User.Role.ENTERPRISE:
            EnterpriseProfile.objects.create(
                user=user, 
                business_name=f"{user.first_name} {user.last_name}".strip() or f"Enterprise {user.username}",
                location=location
            )
        return user

class WorkerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = WorkerProfile
        fields = '__all__'

class EnterpriseProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EnterpriseProfile
        fields = '__all__'

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

class VerificationTaskSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = VerificationTask
        fields = '__all__'

class WorkerVerificationSerializer(serializers.ModelSerializer):
    task_detail = VerificationTaskSerializer(source='task', read_only=True)
    worker_name = serializers.CharField(source='worker.user.username', read_only=True)
    
    class Meta:
        model = WorkerVerification
        fields = '__all__'
        read_only_fields = ['status', 'reviewed_at', 'admin_notes', 'worker']

class JobSerializer(serializers.ModelSerializer):
    enterprise_name = serializers.CharField(source='enterprise.business_name', read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['enterprise']

class JobApplicationSerializer(serializers.ModelSerializer):
    job_detail = JobSerializer(source='job', read_only=True)
    worker_detail = WorkerProfileSerializer(source='worker', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'enterprise', 'worker', 'sender_role', 'body', 'sent_at', 'is_read', 'sender_name']
        # enterprise and sender_role are set automatically by the backend from the logged-in user
        read_only_fields = ['sender_role', 'sent_at', 'sender_name']

    def get_sender_name(self, obj):
        if obj.sender_role == 'ENTERPRISE':
            return obj.enterprise.business_name
        return f"{obj.worker.user.first_name} {obj.worker.user.last_name}".strip() or obj.worker.user.username


