import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import User

print("Current Users in Database:")
users = User.objects.all()
if users.exists():
    for user in users:
        print(f"- {user.username} (Role: {user.role}, Phone: {user.phone_number})")
else:
    print("Database is empty.")
