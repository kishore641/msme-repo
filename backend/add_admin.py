import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import User

username = "kishorenanda1234@gmail.com"
email = "kishorenanda1234@gmail.com"
password = "nanda"

try:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.email = email
    user.role = User.Role.ADMIN
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Updated existing admin user: {username}")
except User.DoesNotExist:
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        role=User.Role.ADMIN
    )
    print(f"Created new admin user: {username}")
