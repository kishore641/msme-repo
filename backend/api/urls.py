from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, login_view, UserProfileView,
    WorkerProfileViewSet, EnterpriseProfileViewSet,
    CourseCategoryViewSet, CourseViewSet, VerificationTaskViewSet, WorkerVerificationViewSet,
    JobViewSet, JobApplicationViewSet, ReviewViewSet, MessageViewSet
)

router = DefaultRouter()
router.register(r'workers', WorkerProfileViewSet)
router.register(r'enterprises', EnterpriseProfileViewSet)
router.register(r'course-categories', CourseCategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'verification-tasks', VerificationTaskViewSet)
router.register(r'verifications', WorkerVerificationViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'job-applications', JobApplicationViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', login_view, name='auth_login'),
    path('auth/me/', UserProfileView.as_view(), name='auth_me'),
]

