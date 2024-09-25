import re
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

RUNNING_PROCESSES = {}

stage_progress = {
    "installing_dependencies": {
        "^Run `npm audit` for details": 70,
    },
}

channel_layer = get_channel_layer()

class ProjectGenerationProgress:

    @staticmethod
    def track_progress(process, process_id, progress_dict: dict):
        regex_patterns = {
            re.compile(pattern): progress for pattern, progress in progress_dict.items()
        }
        while process.poll() is None:
            output = process.stdout.readline().strip()
            for pattern, progress in regex_patterns.items():
                if pattern.search(output):
                    print(process_id, "{:.2f}%".format(progress))
                    async_to_sync(channel_layer.group_send)(
                        process_id,
                        {
                            "type": "project_progress",
                            "message": progress,
                        },
                    )
                    break

    def store_process(process_id, process, stage):
        RUNNING_PROCESSES[process_id] = process
        if stage in stage_progress:
            ProjectGenerationProgress.track_progress(
                process, process_id, stage_progress[stage]
            )
        else:
            print(f"Stage '{stage}' not recognized. No progress tracking will be applied.")
            
    def store_func_progress(project_id, progress_amount):
        async_to_sync(channel_layer.group_send)(
            project_id,
            {
                "type": "project_progress",
                "message": progress_amount,
            },
        )
        