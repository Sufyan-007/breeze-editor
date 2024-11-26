from rest_framework import serializers
    
class AddCustomPackageRequestBodySerializer(serializers.Serializer):
    file = serializers.FileField(help_text="Upload the file")
    fileName = serializers.CharField(help_text="Name of the file")
    
class FolderSerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Name of the folder")
    lastModified = serializers.DateTimeField(help_text="Last modified date and time of the folder")

class GetCustomPackageResponse200Serializer(serializers.Serializer):
    folders = serializers.ListSerializer(
        child=FolderSerializer(),
        help_text="List of folders, each containing a name and last modified date"
    )
    
class DeleteCustomPackageRequestBodySerializer(serializers.Serializer):
    fileName = serializers.CharField(help_text="Name of the file")
    
class SetEnvironmentSerializer(serializers.Serializer):
    environmentName = serializers.CharField(help_text="Name of the environment")
    
class SetEnvironmentResponse200Serializer(serializers.Serializer):
    status = serializers.CharField(help_text="Status of the operation")
    message = serializers.CharField(help_text="Detailed message describing the status")

class DependenciesSerializer(serializers.Serializer):
    react_router_dom = serializers.CharField(
        help_text="Version of React Router DOM", required=False
    )
    bootstrap = serializers.CharField(
        help_text="Version of Bootstrap", required=False
    )
    react_bootstrap = serializers.CharField(
        help_text="Version of React Bootstrap", required=False
    )
    react = serializers.CharField(
        help_text="Version of React", required=False
    )
    react_dom = serializers.CharField(
        help_text="Version of React Dom", required=False
    )

class ProjectDetailsSerializer(serializers.Serializer):
    name = serializers.CharField(
        help_text="The name of the project which is used by the system"
    )
    description = serializers.CharField(
        help_text="Description of the project", required=False, allow_null=True
    )
    author = serializers.CharField(
        help_text="Author of the project", required=False, allow_null=True
    )
    framework = serializers.CharField(
        help_text="The framework used (e.g., React)"
    )
    language = serializers.CharField(
        help_text="Programming language (e.g., JavaScript)"
    )
    styling = serializers.CharField(
        help_text="Styling framework or library used (e.g., Bootstrap)"
    )
    buildTool = serializers.CharField(
        help_text="The build tool for the project (e.g., Create React App)"
    )
    logo = serializers.CharField(
        help_text="URL or path to the logo", required=False, allow_null=True
    )
    projectPath = serializers.CharField(
        help_text="The path where the project will be located"
    )
    defaultComponent = serializers.CharField(
        help_text="The default component of the project"
    )
    projectName = serializers.CharField(
        help_text="The project name given by the user"
    )
    currentEnvironment = serializers.CharField(
        help_text="Current environment for the project", required=False, allow_null=True
    )
    path = serializers.CharField(
        help_text="Full file path for the project"
    )
    componentsSrcDir = serializers.CharField(
        help_text="Directory where component source files are stored"
    )
    dependencies = DependenciesSerializer(
        help_text="Project dependencies", required=False
    )

class GetAllResponse200Serializer(serializers.Serializer):
    name = ProjectDetailsSerializer(
        help_text="Details of the project"
    )

class ProjectFormDataSerializer(serializers.Serializer):
    name = serializers.CharField(
        help_text="The name of the project used by the system"
    )
    author = serializers.CharField(
        help_text="The name of the author of the project"
    )
    language = serializers.CharField(
        help_text="The programming language used in the project (e.g., JavaScript)"
    )
    styling = serializers.CharField(
        help_text="Styling framework used in the project (e.g., Bootstrap)"
    )
    buildTool = serializers.CharField(
        help_text="The build tool used to create the app (e.g., Create React App)"
    )
    technology = serializers.CharField(
        help_text="The technology used for the project (e.g., React)"
    )


class AddResponse200Serializer(serializers.Serializer):
    name = serializers.CharField()
    

class FilterConditionSerializer(serializers.Serializer):
    operation = serializers.CharField()
    condition = serializers.ListField(
        child=serializers.CharField()
    )

class ManageResourceRequestBodySerializer(serializers.Serializer):
    category = serializers.CharField()
    resource = serializers.CharField()
    select = serializers.ListField(
        child=serializers.CharField()
    )
    filter = FilterConditionSerializer()  # Nested filter object
    order = serializers.CharField()
    limit = serializers.CharField()
    offset = serializers.CharField()
    count = serializers.CharField()
    libname = serializers.CharField()
    libversion = serializers.CharField()
    module = serializers.CharField()
    files = serializers.CharField()
    

class ResourceBodySerializer(serializers.Serializer):
    datatype = serializers.CharField()
    defaultValue = serializers.CharField()
    description = serializers.CharField()
    declarationType = serializers.CharField()

class ResourceSerializer(serializers.Serializer):
    name = serializers.CharField()
    type = serializers.CharField()
    body = ResourceBodySerializer()
    id = serializers.CharField()

class HtmlElementSerializer(serializers.Serializer):
    type = serializers.CharField()
    elementType = serializers.CharField()
    typeId = serializers.CharField()
    tagName = serializers.CharField()
    attributes = serializers.DictField(child=serializers.CharField())
    children = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
class ImportsSerializer(serializers.Serializer):
    components = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of component imports",
        required=False
    )
    other = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of other imports",
        required=False
    )
class ManageResourceResponse200Serializer(serializers.Serializer):
    name = serializers.CharField(help_text="Name of the component")
    id = serializers.CharField(help_text="ID of the component")
    containingFile = serializers.CharField(help_text="File where the component is contained")
    imports = ImportsSerializer()
    propsVars = serializers.ListField(child=serializers.CharField())
    resources = ResourceSerializer(many=True)
    html = serializers.DictField(child=serializers.CharField())
    wrapper_store = serializers.CharField(allow_null=True)
    html_elements = HtmlElementSerializer()

class AddOrUpdateThirdPartyRequestBodySerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Name of the package")
    version = serializers.CharField(help_text="Version of the package")

class GetThirdPartyResponse200Serializer(serializers.Serializer):
    package_name = serializers.CharField(help_text="Package name and its version")

class ProjectFormSerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Name of the project", max_length=255)
    author = serializers.CharField(help_text="Author name", max_length=255)
    language = serializers.CharField(
        help_text="Programming language used in the project", 
        max_length=255, 
        required=False
    )
    styling = serializers.CharField(
        help_text="Styling used in the project", 
        max_length=255, 
        required=False
    )
    buildTool = serializers.CharField(
        help_text="Command to create app", 
        max_length=255, 
        required=False
    )
    technology = serializers.CharField(
        help_text="Name of technology", 
        max_length=255, 
        required=False
    )
   
