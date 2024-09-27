from apps.common.utils.path_extractor import get_path_without_ext


def generate_imports_code(component_config, all_config,all_store_config,all_reducer_config):
    # print(component_config)
    imported_components = component_config['imports']['components']
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
                import_statement = f'import  {{{imp["import_entity"]}}} from \'{imp["from"]}\' ;'
            
            import_statements.append(import_statement)
        
        elif imp['TYPE'] == "REDUCER_FUNCTION":
            related_reducer = all_reducer_config.get(imp["from"])
            path = get_path_without_ext(related_reducer['containingFile'])

            if imp['import_entity'] == 'SELECTOR':
                import_statement = "import  {select%s} from '%s';"%(related_reducer["stateVarName"],path)
            else:
                import_statement = f'import  {{{imp["import_entity"]}}} from \'{path}\' ;'
            
            import_statements.append(import_statement)

    return '\n'.join(import_statements)

def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement



