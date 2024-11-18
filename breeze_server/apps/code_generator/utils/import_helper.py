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
                # added a case to check if import is already present
                    # if imp["import_entity"] in imported_components:
                    #     continue
                    # else:
                    import_statement = f'import {imp["import_entity"]} from \'{imp["from"]}\' ;'
                # elif imp['import_type'] == 'SINGLE':
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
            # elif imp['TYPE'] == "REDUCER_FUNCTION":
            #     related_reducer = all_reducer_config.get(imp["from"])
            #     path = get_path_without_ext(related_reducer['containingFile'])

            #     if imp['import_entity'] == 'SELECTOR':
            #         import_statement = "import  {select%s} from '%s';"%(related_reducer["stateVarName"],path)
            #     else:
            #         import_statement = f'import  {{{imp["import_entity"]}}} from \'{path}\' ;'
            #     import_statement_tree.append({
            #         "type": "IMPORT",
            #         "statementType" : "SINGLE",
            #         "code" : import_statement
            #     })
            #     import_statements.append(import_statement)
            # elif imp['TYPE'] == "SERVICE":
            #     print("---SERVICE TYPE****")
            #     import_path = imp["from"]
            #     import_statement = f'import {{ {imp["import_entity"]} }} from \'{import_path}\' ;'
            #     import_statement_tree.append({
            #         "type": "IMPORT",
            #         "statementType" : "SINGLE",
            #         "code" : import_statement
            #     })
            #     import_statements.append(import_statement)
            
            
            
            
        
        # print(component_config)
        # imported_components = component_config['imports'].get('components',[])
        # imported_store = component_config['imports'].get('store',[]) 
    
        
        # directory_management_service = DirectoryManager(app_config["name"])

        # Handle import for components
        # for ic in imported_components:
        #     related_comp = comp_config_index[ic]
        #     path = directory_management_service.get_path_from_file_id(related_comp["file_id"],relative_path=True)
        #     comp_path = get_path_without_ext(path)

        #     import_statement = f'import {related_comp["name"]} from \'/{comp_path}\';'
        #     import_statement_tree.append({
        #         "type": "IMPORT",
        #         "statementType" : "SINGLE",
        #         "code" : import_statement
        #     })
        #     import_statements.append(import_statement)

        # Handle import for redux store
        # for i in imported_store:
        #     related_store = all_store_config[i]
        #     store_path = get_path_without_ext(related_store['containingFile'])

        #     import_statement = f'import {related_store["name"]} from \'{store_path}\';'
        #     import_statement_tree.append({
        #         "type": "IMPORT",
        #         "statementType" : "SINGLE",
        #         "code" : import_statement
        #     })
        #     import_statements.append(import_statement)

        # Handle other imports

        
        # Handle CSS imports

        # for imp in component_config['imports'].get('styles', []):

        #     print("CSSSSSSSSSS")
        #     if imp['TYPE'] == 'CUSTOM':
        #         imp_path = app_config['CSS_CONFIG'][imp['from']]['containingFile']
        #         import_statement = f'import \'{imp_path}\' ; '
        #         import_statement_tree.append({
        #             "type": "IMPORT",
        #             "statementType" : "SINGLE",
        #             "code" : import_statement
        #         })
        #         import_statements.append(import_statement)
                
        import_statements = list(set(import_statements))
        return '\n'.join(import_statements),import_statement_tree

    @staticmethod
    def handle_import(component_config, comp_config_index, all_store_config):
        pass

    @staticmethod
    def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement
