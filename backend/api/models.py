from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        WORKER = "WORKER", "Worker"
        ENTERPRISE = "ENTERPRISE", "Enterprise"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.WORKER)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

class WorkerProfile(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        SKILLED = "SKILLED", "Skilled"
        EXPERT = "EXPERT", "Expert"

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        RESUBMIT = "RESUBMIT", "Resubmit"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
    skills = models.TextField(blank=True, help_text="Comma separated skills")
    level = models.CharField(max_length=15, choices=Level.choices, default=Level.BEGINNER)
    verification_status = models.CharField(max_length=15, choices=VerificationStatus.choices, default=VerificationStatus.PENDING)
    verification_note = models.TextField(blank=True, help_text="Admin notes regarding the verification status")
    is_verified = models.BooleanField(default=False)
    location = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0.0)
    jobs_completed = models.IntegerField(default=0)
    experience_years = models.IntegerField(default=0)
    expected_wage = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    id_proof = models.FileField(upload_to='worker_docs/id_proofs/', null=True, blank=True)
    certificates = models.FileField(upload_to='worker_docs/certificates/', null=True, blank=True)
    work_photos = models.FileField(upload_to='worker_docs/work_photos/', null=True, blank=True)
    
    # GPS Integration
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.level}"

class EnterpriseProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='enterprise_profile')
    business_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, null=True, blank=True)
    
    # GPS Integration
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.business_name

class CourseCategory(models.Model):
    name = models.CharField(max_length=50) # e.g. "Safety Training"
    description = models.TextField()

    def __str__(self):
        return self.name

class Course(models.Model):
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE, related_name="courses")
    title = models.CharField(max_length=100)
    description = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    media_file = models.FileField(upload_to='courses/', blank=True, null=True)

    def __str__(self):
        return self.title

class VerificationTask(models.Model):
    class Method(models.TextChoices):
        VIDEO = "VIDEO", "Video"
        IMAGE = "IMAGE", "Image"
        AUDIO = "AUDIO", "Audio"
        QUIZ = "QUIZ", "Quiz"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="verification_tasks")
    method = models.CharField(max_length=10, choices=Method.choices)
    prompt_text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course.title} - {self.method}"

class WorkerVerification(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name="verifications")
    task = models.ForeignKey(VerificationTask, on_delete=models.CASCADE)
    submitted_file = models.FileField(upload_to='verifications/%Y/%m/%d/')
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

class Job(models.Model):
    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    enterprise = models.ForeignKey(EnterpriseProfile, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=100)
    description = models.TextField()
    skill_required = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class JobApplication(models.Model):
    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    applied_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="review")
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name="reviews")
    enterprise = models.ForeignKey(EnterpriseProfile, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comments = models.TextField(blank=True)

class Message(models.Model):
    """In-app chat between an enterprise and a worker."""
    enterprise = models.ForeignKey(EnterpriseProfile, on_delete=models.CASCADE, related_name='messages')
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='messages')
    sender_role = models.CharField(max_length=20, choices=[('ENTERPRISE', 'Enterprise'), ('WORKER', 'Worker')])
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['sent_at']

    def __str__(self):
        return f"{self.enterprise} ↔ {self.worker} [{self.sender_role}]"
