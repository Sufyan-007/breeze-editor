import os,subprocess 

RUNNING_APPS = {}

import subprocess
import platform
import re

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



def start_app(app_config):
    project_id=app_config["name"]
    project_path = os.path.join(app_config["path"],project_id)
    if project_id in RUNNING_APPS:
        pass
    else:
        print("Starting :", project_id)
        port= 3010+len(RUNNING_APPS)
        RUNNING_APPS[project_id] = port
        kill_process_on_port(port)
        env = os.environ.copy()
        env['PORT'] = str(port)
        env['BROWSER'] =  "NONE"
        process = subprocess.Popen(" ".join(['npm', 'start','0.0.0.0']), shell=True,env=env,stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, cwd=project_path,  )
        # process.wait()
        # process=subprocess.run(command, cwd=project_path, env=environment)

    
    return {"project_id":project_id,"port":RUNNING_APPS[project_id]}