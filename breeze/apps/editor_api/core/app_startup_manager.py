import os,subprocess 

RUNNING_APPS = {}

def start_app(app_config):
    project_id=app_config["name"]
    project_path = os.path.join(app_config["path"],project_id)
    if project_id in RUNNING_APPS:
        pass
    else:
        print("Starting :", project_id)
        port= 3010+len(RUNNING_APPS)
        RUNNING_APPS[project_id] = port
        kill_command = ["fuser", "-k", f"{port}/tcp"]
        # subprocess.run(kill_command)
        env = os.environ.copy()
        env['PORT'] = str(port)
        env['BROWSER'] =  "NONE"
        process = subprocess.Popen(" ".join(['npm', 'start','0.0.0.0']), shell=True,env=env,stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=project_path,  )
        # process.wait()
        # process=subprocess.run(command, cwd=project_path, env=environment)

    
    return {"project_id":project_id,"port":RUNNING_APPS[project_id]}