#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from dotenv import load_dotenv
import environ


def main():
    """Run administrative tasks."""
    load_dotenv()
    settings_env =os.environ.get("RUN_ENV") 

    env = environ.Env()
    environ.Env.read_env()
    run_env =env('RUN_ENV') 
    print(settings_env)
    settings_env = 'breeze_server.settings.%s'%(run_env)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_env)
    
    # Set default host and port from environment variables
    run_env =run_env.upper()
    host_key = run_env+"_SERVER_HOST" 
    host = env(host_key)
    port_key = run_env+ "_SERVER_PORT"
    port = env(port_key)
    server = f'{host}:{port}'
    if server not in sys.argv:
        sys.argv += [server]

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
