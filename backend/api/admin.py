from django.contrib import admin
from .models import (
    User, WorkerProfile, EnterpriseProfile, CourseCategory, Course,
    VerificationTask, WorkerVerification, Job, JobApplication, Review
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'phone_number', 'role')

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'is_verified', 'rating')
    list_filter = ('is_verified', 'level')

@admin.register(WorkerVerification)
class WorkerVerificationAdmin(admin.ModelAdmin):
    list_display = ('worker', 'task', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('worker__user__username',)

admin.site.register(EnterpriseProfile)
admin.site.register(CourseCategory)
admin.site.register(Course)
admin.site.register(VerificationTask)
admin.site.register(Job)
admin.site.register(JobApplication)
admin.site.register(Review)
