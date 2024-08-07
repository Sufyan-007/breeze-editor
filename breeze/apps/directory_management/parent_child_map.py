def build_parent_child_map(config_data):
    parent_child_map = {}
    
    for node_id, node in config_data.items():
        for parent_id in node['lineage']:
            if parent_id not in parent_child_map:
                parent_child_map[parent_id] = []
            parent_child_map[parent_id].append(node_id)
    
    return parent_child_map