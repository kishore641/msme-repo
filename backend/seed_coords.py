import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import WorkerProfile, EnterpriseProfile

def seed_coords():
    # Near a central point (e.g., Delhi)
    base_lat, base_lng = 28.6139, 77.2090
    
    # Update Enterprise (if exists)
    e = EnterpriseProfile.objects.first()
    if e:
        e.latitude = base_lat
        e.longitude = base_lng
        e.save()
        print(f"Updated Enterprise {e.business_name} coords")
    
    # Update Workers with slight variations
    workers = WorkerProfile.objects.all()
    coords = [
        (28.6210, 77.2150),
        (28.6150, 77.2250),
        (28.6050, 77.2050),
        (28.6350, 77.1950),
        (28.5950, 77.2350),
    ]
    
    for i, w in enumerate(workers):
        lat, lng = coords[i % len(coords)]
        # Add a tiny bit of randomness if we have more workers than coords
        w.latitude = lat + (0.001 * (i // len(coords)))
        w.longitude = lng + (0.001 * (i // len(coords)))
        w.is_available = (i % 3 != 0) # Mock availability
        w.save()
        print(f"Updated Worker {w.user.username} coords")

if __name__ == "__main__":
    seed_coords()
