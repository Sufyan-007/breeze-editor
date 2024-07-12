source venv/bin/activate
fuser -k 8000/tcp
fuser -k 3000/tcp
nohup python3 breeze/manage.py runserver 0.0.0.0:8000 &
(cd editor_ui && nohup npm start 0.0.0.0) &
