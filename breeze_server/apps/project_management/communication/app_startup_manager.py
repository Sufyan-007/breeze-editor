import os,subprocess 
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

RUNNING_APPS = {}

import subprocess
import platform
import re
import threading

def kill_process_on_port(port):
    current_os = platform.system()
    
    if current_os in ["Linux", ]:  
        # Find the process ID (PID) of the process using the port
        result = subprocess.run(['lsof', '-t', f'-i:{port}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        pids = result.stdout.strip().split()
        if pids:
            for pid in pids:
                subprocess.run(['kill', '-9', pid])
            print(f"Process running on port {port} has been killed.")
        
    elif current_os == "Windows":
        # Find the process ID (PID) of the process using the port
        result = subprocess.run(['netstat', '-ano'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        lines = result.stdout.splitlines()
        
        # Extract the PID from the netstat output
        pids = []
        for line in lines:
            if re.search(f':{port}\\s', line):  # Adding \\s to avoid matching partial numbers
                pids.append( line.split()[-1])
                break
        
        if pids:
            for pid in pids:
                subprocess.run(['taskkill', '/F', '/PID', pid])
            print(f"Process running on port {port} has been killed.")

def run_project_threaded(project_id,port,project_path, env_name):
    env = os.environ.copy()
    env['PORT'] = str(port)
    env['BROWSER'] =  "NONE"
    channel_layer = get_channel_layer()
    
    if not env_name or env_name == 'dev (default)':
        env_name = 'dev'
    # modified as per vite
    process = subprocess.Popen(" ".join(['npm', 'run', f'{env_name}', '--', '--host', '0.0.0.0', '--port', str(port), '--debug']), shell=True,env=env,stdout=subprocess.PIPE, stderr=subprocess.STDOUT, cwd=project_path,  )
    status_mapping = {
    b'VITE v': "Starting",
    b'ready in': "Running",
    b'Local:': "Running",
    b'Network:': "Running",
    b'[vite] warning': "Warning",
    b'Internal server error': "Error",
    b'[vite] hmr update' : 'Running',
}
    while True:
        output = process.stdout.readline()
        if output: 
            # print('*', output)
            decoded_output = output.decode().strip()
            for key, status in status_mapping.items():
                key_str = key.decode().strip()
                if re.search(re.escape(key_str), decoded_output, re.IGNORECASE):
                    # print(project_id, '==',status)
                    RUNNING_APPS[project_id]['status'] = status
                    async_to_sync(channel_layer.group_send)(
                        project_id,
                        {
                            "type": "app_status",
                            "message": {"project_id": project_id, "status": status},
                        }
                    )


def start_app(app_config, forceRestart=False):
    
    project_id = app_config["name"]
    env_name = app_config.get("currentEnvironment", "")
    project_path = app_config["path"]
    if project_id in RUNNING_APPS and not forceRestart:
        pass
    else:
        print("Starting :", project_id)
        port= 3010+len(RUNNING_APPS)
        kill_process_on_port(port)
        thread = threading.Thread(target=run_project_threaded,args= [project_id,port,project_path, env_name])
        thread.daemon = True
        thread.start()
        RUNNING_APPS[project_id] = {'port':port,'thread':thread,'status':"COMPILING.."}
        # process.wait()
        # process=subprocess.run(command, cwd=project_path, env=environment)

    
    return {"project_id":project_id,"port":RUNNING_APPS[project_id]['port']}