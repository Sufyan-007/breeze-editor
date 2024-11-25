import os
import json
from datetime import datetime, timezone
from apps.common.constants.consts import CONFIG_PATH
def get_uploaded_resources(project_name, tag):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        uploaded_resources_config_path = os.path.join(
            app_config_dir, "uploaded_resources_config.json"
        )

        # custom_uploads_path = os.path.join(react_app_dir,CUSTOM_UPLOADS)
        if not os.path.exists(uploaded_resources_config_path):
            return {"folders": []}
        
        files = []

        with open(uploaded_resources_config_path, "r") as config_file:
            resources_config = json.load(config_file)

        for key, value in resources_config.items():
            if value.get('tag', 'RESOURCE') == tag:
                files.append({
                "name": value.get("name"),
                "zip_file_id": key,
                "lastModified": datetime.fromtimestamp(
                    os.path.getmtime(os.path.join(uploaded_resources_config_path))
                )
                .astimezone(timezone.utc)
                .strftime("%Y-%m-%d"),
                "status": value.get("status"),
            })
            elif not tag and value.get('tag') != "ZIP":
                files.append({
                    "id" : key,
                    "name": value.get("name"),
                    "type": value.get("type"),
                })

        return {"folders": files}
    except Exception as e:
        raise Exception(
            f"An error occurred while retrieving extracted folders: {str(e)}"
        )
