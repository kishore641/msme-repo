import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import EnterpriseProfile

print("Enterprise Profiles:")
eps = EnterpriseProfile.objects.all()
if eps.exists():
    for ep in eps:
        print(f"- Business: {ep.business_name}, User: {ep.user.username}, Role: {ep.user.role}")
else:
    print("No Enterprise Profiles found.")
