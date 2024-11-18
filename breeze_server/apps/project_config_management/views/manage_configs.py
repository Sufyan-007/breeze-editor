import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.common.utils.file_helpers.config_handler import write_config_file, read_config_file
from apps.common.utils.file_helpers.config_tracker import rollback_config_file, rollforward_config_file
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['POST'],
    request=None,
    responses=None
)
@csrf_exempt
@api_view(['POST'])
def update_configs(request, project_id):
    
    transaction_id = getattr(request, "transaction_id", None)
    data = json.loads(request.body.decode("utf-8"))
    category = data.get("category")
    filename = data.get("filename")
    config_data = data.get("configData")
    current_config_version = data.get("currentConfigVersion")
    
    if data.get('updateMethod') == 'ROLLBACK':
        rollback_config_file(project_id, category, filename, data.get('version'))
    elif data.get('updateMethod') == 'ROLLFORWARD':
        rollforward_config_file(project_id, category, filename)
    elif data.get('updateMethod') == 'WRITE':
        # write_config_file(project_id, "routing_config", "routing_config", {
        #     "adb4fc12_414b_4ad2_89c5_631538232e68": {
        #         "componentId": "0d39cf24_fc75_451e_b992_f5fe136819f5",
        #         "id": "adb4fc12_414b_4ad2_89c5_631538232e68",
        #         "parentId": None,
        #         "path": "/",
        #         "loader": "() => {}"
        #     },
        #     "10a1b6cf_7b9d_494c_86b9_518f1ddaa449": {
        #         "componentId": "0d39cf24_fc75_451e_b992_f5fe136819f5",
        #         "id": "10a1b6cf_7b9d_494c_86b9_518f1ddaa449",
        #         "parentId": None,
        #         "path": "/breeze/sandbox"
        #     }
        # }, transaction_id)    
        write_config_file(project_id, category, filename, config_data, current_config_version, transaction_id)
    config_data = read_config_file(project_id, category, filename)['data']
    return JsonResponse(config_data, status=200)