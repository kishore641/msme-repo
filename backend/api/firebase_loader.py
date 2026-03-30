import firebase_admin
from firebase_admin import credentials, auth

# Ensure we don't initialize multiple times during hot reloads
if not firebase_admin._apps:
    try:
        # Attempts to initialize with default credentials or environment variables
        default_app = firebase_admin.initialize_app()
        print("Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"Firebase Admin initialization skipped or failed: {e}")
        # We don't raise here so the rest of the app (database/standard auth) can still work
