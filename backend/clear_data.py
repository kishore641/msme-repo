import os
import django
import shutil

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.conf import settings
from api.models import User, WorkerProfile, EnterpriseProfile

def clear_data():
    print("Full Cleanup initiated...")
    
    # 1. Delete media files
    media_path = os.path.join(settings.BASE_DIR, 'media')
    if os.path.exists(media_path):
        for item in os.listdir(media_path):
            item_path = os.path.join(media_path, item)
            try:
                if os.path.isfile(item_path):
                    os.unlink(item_path)
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                print(f"Deleted media item: {item}")
            except Exception as e:
                print(f"Failed to delete {item}: {e}")

    # 2. Delete non-admin users (cascaded profiles)
    workers_deleted = User.objects.filter(role=User.Role.WORKER).delete()
    enterprises_deleted = User.objects.filter(role=User.Role.ENTERPRISE).delete()
    
    # 3. Clear all remaining tables
    from api.models import (
        WorkerVerification, Job, JobApplication, Message, 
        Course, CourseCategory, VerificationTask
    )
    
    # Order matters for foreign keys
    WorkerVerification.objects.all().delete()
    VerificationTask.objects.all().delete()
    JobApplication.objects.all().delete()
    Job.objects.all().delete()
    Message.objects.all().delete()
    Course.objects.all().delete()
    CourseCategory.objects.all().delete()
    
    print(f"Deleted {workers_deleted[0]} workers.")
    print(f"Deleted {enterprises_deleted[0]} enterprises.")
    print("All media, courses, categories, jobs, and messages have been cleared.")
    print("Cleanup complete! You can start fresh.")

if __name__ == "__main__":
    clear_data()
