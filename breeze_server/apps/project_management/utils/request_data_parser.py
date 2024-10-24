import json

def parse_request_data(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        package_name = data.get("name")
        package_version = data.get("version")

        if not package_name or (request.method != "DELETE" and not package_version):
            raise ValueError("Both package name and version are required.")
        return package_name, package_version
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON data.")