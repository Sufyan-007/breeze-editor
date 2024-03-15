import re
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json
from .consumers import EchoConsumer

web_socket = EchoConsumer()


RUNNING_PROCESSES = {}

create_react_app_progress = {
    "^Installing packages": 20,
    "^Initialized a git repository": 50,
    "^Created git commit": 60,
    "^Happy hacking!": 80,
}


class ProjectGenerationProgress:

    def generate_app_progress(self):
        print(1)

    @staticmethod
    def run_process(process, process_id, progress_dict: dict):
        channel_layer = get_channel_layer()
        print("channel_layer",channel_layer)
        # Pre-compile regex patterns for efficiency, storing them with their associated progress.
        regex_patterns = {
            re.compile(pattern): progress for pattern, progress in progress_dict.items()
        }
        while process.poll() is None:
            output = process.stdout.readline().strip()
            for pattern, progress in regex_patterns.items():
                if pattern.search(output):
                    print(process_id, "{:.2f}%".format(progress))
                    # web_socket.send_progress_update({ "message" : "{:.2f}%".format(progress) })
                    async_to_sync(channel_layer.group_send)(
                        process_id, 
                        {
                            "type": "progress_update",
                            "message": "{:.2f}%".format(progress),
                        },
                    )
                    print("sending p")
                    # TODO: Send out response to frontend about the status of the process here.
                    break

    def store_process(process_id, process):
        RUNNING_PROCESSES[process_id] = process
        ProjectGenerationProgress.run_process(
            process, process_id, create_react_app_progress
        )
