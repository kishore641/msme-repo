import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import User, WorkerProfile, EnterpriseProfile

print("Checking for profile overlap...")
users = User.objects.all()
for user in users:
    has_worker = hasattr(user, 'worker_profile')
    has_enterprise = hasattr(user, 'enterprise_profile')
    if has_worker and has_enterprise:
        print(f"⚠️ User {user.username} has BOTH profiles!")
    elif has_worker:
        print(f"User {user.username}: Worker Only")
    elif has_enterprise:
        print(f"User {user.username}: Enterprise Only")
    else:
        print(f"User {user.username}: No Profile (Admin or Error)")
