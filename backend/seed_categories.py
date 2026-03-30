import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import CourseCategory

def seed_categories():
    categories = [
        {"name": "Electrician", "description": "Core safety and wiring standards for electrical workers."},
        {"name": "Plumbing", "description": "Hydraulic systems, pipe assembly, and maintenance training."},
        {"name": "Carpentry", "description": "Woodworking, structural framing, and finishing techniques."},
        {"name": "General Construction", "description": "Site safety, masonry, and foundational labor training."},
        {"name": "Safety & Compliance", "description": "Universal workplace safety and tool handling certifications."},
        {"name": "Painter", "description": "Surface preparation, painting techniques, and finishing."},
        {"name": "Computer Hardware", "description": "Basic hardware repair and maintenance training."},
    ]

    print("Seeding Course Categories...")
    for cat in categories:
        obj, created = CourseCategory.objects.get_or_create(
            name=cat["name"],
            defaults={"description": cat["description"]}
        )
        if created:
            print(f"Added Category: {cat['name']}")
        else:
            print(f"Existing Category: {cat['name']}")
    
    print("Done!")

if __name__ == "__main__":
    seed_categories()
