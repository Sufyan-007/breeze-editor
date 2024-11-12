#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from dotenv import load_dotenv
from pathlib import Path


def main():
    """Run administrative tasks."""
    load_dotenv()
    environment =os.environ.get("RUN_ENV") 
    
    BASE_DIR = Path(__file__).resolve().parent
    path=os.path.join(BASE_DIR, '.env.%s'%(environment))
    
    load_dotenv(path)
    
    host = os.getenv("SERVER_HOST")
    port = os.getenv("SERVER_PORT")
    server = f'{host}:{port}'
    
    settings_env = 'breeze_server.settings'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_env)

    # if server not in sys.argv:
    #     sys.argv += [server]
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(sys.argv)
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

if __name__ == '__main__':
    main()
