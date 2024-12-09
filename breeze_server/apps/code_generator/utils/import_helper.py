from apps.common.utils.path_extractor import get_path_without_ext
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.entity_management.core.entity_management import EntityManager

class ImportHelper:
    def __init__(self):
        pass

    @staticmethod
    def generate_imports_code(imports,projectId, file_id):
        directory_management_service = DirectoryManager(projectId)
        entityManager = EntityManager(projectId)
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
            importEntity = entityManager.get_and_use_entity(imp["id"],fileId=file_id)
            
            path = "/"+directory_management_service.get_path_from_file_id(importEntity["fileId"],relative_path=True)
            if importEntity["defaultExport"]:
                import_statement = f'import {importEntity["exportedAs"]} from \'{path}\' ;'
            else:
                import_statement = f'import  {{ {importEntity["exportedAs"]} }} from \'{path}\' ;'
                
            import_statement_tree.append({
                "type": "IMPORT",
                "statementType" : "SINGLE",
                "code" : import_statement
            })
            import_statements.append(import_statement)
            
        import_statements = import_statements
        return '\n'.join(import_statements),import_statement_tree

