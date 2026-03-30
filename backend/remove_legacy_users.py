import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import User

legacy_phone_numbers = ["8143272410", "8142027323"]
for phone in legacy_phone_numbers:
    deleted, _ = User.objects.filter(username=phone).delete()
    if deleted:
        print(f"Removed legacy user: {phone}")

admin = User.objects.filter(username="admin").delete()
print("Cleanup complete!")
