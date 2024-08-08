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
    
    if env_name == '' or env_name == 'default (.env)':
        process = subprocess.Popen(" ".join(['npm', 'start','0.0.0.0']), shell=True,env=env,stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, cwd=project_path,  )
    else:
        process = subprocess.Popen(" ".join(['npm', f'run start:{env_name}','0.0.0.0']), shell=True,env=env,stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, cwd=project_path,  )
    
    status_mapping = {
    b'webpack compiled successfully': "RUNNING",
    b'Compiled with warnings': "WARNING",
    b'Failed to compile': "ERROR",
    b'The build failed' : "CRASHED"
}

    while True:
        output = process.stdout.readline()
        if output:
            # print(project_id)
            # print("====================", output, "===================")
            
            for key, status in status_mapping.items():
                if output.startswith(key):
                    RUNNING_APPS[project_id]['status'] = status
                    async_to_sync(channel_layer.group_send)(
                        project_id,
                        {
                            "type": "app_status",
                            "message": {"project_id": project_id, "status": status},
                        }
                    )
                pass


def start_app(app_config, forceRestart=False):
    project_id = app_config["name"]
    env_name = app_config.get("current_environment","")
    project_path = os.path.join(app_config["path"],project_id)
    if project_id in RUNNING_APPS and not forceRestart:
        pass
    else:
        print("Starting :", project_id)
        port= 3010+len(RUNNING_APPS)
        kill_process_on_port(port)
        thread = threading.Thread(target=run_project_threaded,args= [project_id,port,project_path, env_name])
        thread.daemon = True
        thread.start()
        RUNNING_APPS[project_id] = {'port':port,'thread':thread,'status':"COMPILATION_STARTED"}
        # process.wait()
        # process=subprocess.run(command, cwd=project_path, env=environment)

    
    return {"project_id":project_id,"port":RUNNING_APPS[project_id]['port']}