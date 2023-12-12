from utils.path_extractor import get_path_without_ext

class ImportHelper:
    def __init__(self):
        pass

    @staticmethod
    def generate_imports_code(component_config, all_config,all_store_config, app_configs={}):
        # print(component_config)
        imported_components = component_config['imports'].get('components',[])
        imported_store = component_config['imports'].get('store',[]) 
    
        import_statements = []

        # Handle import for components
        for ic in imported_components:
            related_comp = all_config[ic]
            comp_path = get_path_without_ext(related_comp['containingFile'])

            import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
            import_statements.append(import_statement)

        # Handle import for redux store
        for i in imported_store:
            related_store = all_store_config[i]
            store_path = get_path_without_ext(related_store['containingFile'])

            import_statement = f'import {related_store["name"]} from \'{store_path}\';'
            import_statements.append(import_statement)

        # Handle other imports
        for imp in component_config['imports']['other']:
            if imp['TYPE'] == "THIRD_PARTY":
                if imp['import_type'] == 'FULL':
                    import_statement = f'import {imp["import_entity"]} from \'{imp["from"]}\' ;'
                # elif imp['import_type'] == 'SINGLE':
                else:
                    import_statement = f'import  {{ {imp["import_entity"]} }} from \'{imp["from"]}\' ;'
                
                import_statements.append(import_statement)
            
            elif imp['TYPE'] == "SERVICE":
                print("---SERVICE TYPE****")
                print(app_configs['MAPPINGS']['SERVICES'][imp["from"]])
                import_path = app_configs['MAPPINGS']['SERVICES'][imp["from"]]
                import_statement = f'import {{ {imp["import_entity"]} }} from \'{import_path}\' ;'

                import_statements.append(import_statement)

        
        # Handle CSS imports

        for imp in component_config['imports'].get('styles', []):

            print("CSSSSSSSSSS")
            if imp['TYPE'] == 'CUSTOM':
                imp_path = app_configs['CSS_CONFIG'][imp['from']]['containingFile']
                import_statement = f'import \'{imp_path}\' ; '

                import_statements.append(import_statement)

        return '\n'.join(import_statements)

    @staticmethod
    def handle_import(component_config, all_config, all_store_config):
        pass

    @staticmethod
    def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement
