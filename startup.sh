source venv/bin/activate
fuser -k 8001/tcp
fuser -k 5173/tcp
fuser -k 5174/tcp
fuser -k 4001/tcp
fuser -k 3000/tcp
nohup python3 breeze/manage.py runserver 0.0.0.0:8000 &
(cd editor_ui && nohup npm start 0.0.0.0) &
