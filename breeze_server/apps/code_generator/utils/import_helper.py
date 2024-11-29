from apps.common.utils.path_extractor import get_path_without_ext
from apps.directory_management.core.directory_management_service import DirectoryManager

class ImportHelper:
    def __init__(self):
        pass

    @staticmethod
    def generate_imports_code(imports,projectId):
        directory_management_service = DirectoryManager(projectId)
        import_statements = []
        import_statement_tree = []
        
        for imp in imports['other']:
            if imp['TYPE'] == "THIRD_PARTY":
                if imp['import_type'] == 'FULL':
                    import_statement = f'import {imp["import_entity"]} from \'{imp["from"]}\' ;'
                else:
                    import_statement = f'import  {{ {imp["import_entity"]} }} from \'{imp["from"]}\' ;'
                import_statement_tree.append({
                    "type": "IMPORT",
                    "statementType" : "SINGLE",
                    "code" : import_statement
                })
                import_statements.append(import_statement)
        
        for imp in imports["components"]:
            path = "/"+directory_management_service.get_path_from_file_id(imp["fileId"],relative_path=True)
            if imp["import_type"] == "FULL":
                import_statement = f'import {imp["import_entity"]} from \'{path}\' ;'
            else:
                import_statement = f'import  {{ {imp["import_entity"]} }} from \'{path}\' ;'
                
            import_statement_tree.append({
                "type": "IMPORT",
                "statementType" : "SINGLE",
                "code" : import_statement
            })
            import_statements.append(import_statement)
            
        import_statements = import_statements
        return '\n'.join(import_statements),import_statement_tree

    @staticmethod
    def handle_import(component_config, comp_config_index, all_store_config):
        pass

    @staticmethod
    def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement
