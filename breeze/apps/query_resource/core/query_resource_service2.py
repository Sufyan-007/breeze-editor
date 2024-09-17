import os
from common.utils.app_consts import CONFIG_PATH
from common.utils.file_helper_temp import read_json_file

class QueryResourceService:
    def __init__(self,project_name):
        self.project_name = project_name
        self.config_path = os.path.join(CONFIG_PATH, project_name) 
        
    def get_json_config_data(self,resource,category):
        try:
            if resource:
                ob_config_data = {}
                config_data = read_json_file(self.project_name, category.lower(),resource,version="5")
                print(config_data,"config data ")
                ob_config_data[resource] = config_data
                return ob_config_data
            else:
                if category:
                    all_resources = self.get_all_resources_for_category(self.project_name,category.lower())
                
                    all_config_data = {}
                    
                    for res in all_resources:
                        config_data = read_json_file(self.project_name, category.lower(), res, version="latest")
                        all_config_data[res] = config_data
                    
                
            
                    return all_config_data
                else:
                    raise ValueError("Category must be specified when resource is not provided.")
            
        except Exception as e:
           print(f"Error loading JSON config: {str(e)}")
           return None
    
    def apply_filter(self, data, resource, filter_criteria, select, category, order=None, limit= None , offset= None):
        filtered_data = None
        operation = filter_criteria.get('operation', 'ALL') 
        conditions = filter_criteria.get('conditions', [])
        order_by = order.get('orderBy') if order else None
        order_direction = order.get('orderDirection', 'asc') if order else 'asc'
        # Parsing the conditions
        parsed_conditions = [self.parse_condition(cond) for cond in conditions]
        
        if resource:
            
            if operation == "ANY":
                if any(self.check_condition(data, cond, resource) for cond in parsed_conditions):
                    filtered_data = data 
                 
            elif operation == "ALL":
                if all(self.check_condition(data, cond, resource) for cond in parsed_conditions):
                    filtered_data = data 
                 
            # If select is provided, filter the fields
            if select:
                
                selected_data = {}
                for key in select:
                    if key in filtered_data[resource]['data'][resource]:
                        selected_data[key] = filtered_data[resource]['data'][resource][key]
                return selected_data  

        
            return filtered_data 
        
        else:
            filtered_results = []
            resources = self.get_all_resources_for_category(self.project_name,category.lower())
          
            for resource in resources:
          
                if operation == "ANY":
                    print("inside ANY operation")
                    if any(self.check_condition(data,cond,resource)for cond in parsed_conditions):
                        filtered_results.append(
                            data[resource]
                        )
                        
                elif operation == "ALL":
                
                    if all(self.check_condition(data,cond,resource)for cond in parsed_conditions):
                        filtered_results.append(
                            data[resource]
                            )
           
            if select:
                selected_results = []
                for result in filtered_results:
                    selected_data = {}
                    resource_name =  next(iter(result['data']), None)# Access the 'name' key to determine the resource
                    resource_data = result['data'].get(resource_name, {})

                    for key in select:
                        if key in resource_data:
                            selected_data[key] = resource_data[key]
                            
                    if selected_data:
                        selected_results.append(selected_data)
                
                # Apply ordering to the selected results
                if order:
                    ordered_results = self.apply_order(selected_results, order_by, order_direction)
                else:
                    ordered_results = selected_results
                
                paginated_results = self.apply_limit_offset(ordered_results, limit, offset)
                return paginated_results
            
             # Apply ordering to the filtered results (if no select)
            if order:
                ordered_results = self.apply_order(filtered_results, order_by, order_direction)
            else:
                ordered_results = filtered_results
                
            paginated_results = self.apply_limit_offset(ordered_results,limit,offset)
            
            return paginated_results
                    
    
    def parse_condition(self,condition):
            key, operator, value = condition.split(":")
            return {
                    'key': key,
                    'operator': operator,
                    'value': value
            }
            
    def check_condition(self,data,condition,resource):
            key = condition['key']
            operator = condition['operator']
            expected_value = condition['value']
            # Splitting the key to handle nested attributes (e.g., 'Main.name')
            keys = key.split('.')
            actual_value = data.get(resource,{}).get('data', {}).get(resource, {}) 
            
            # Traverse the data dictionary using the keys
            for k in keys:
                actual_value = actual_value.get(k)
                if actual_value is None:
                    break  
                
            if operator == 'EQ':
                return actual_value == expected_value
            elif operator == 'NEQ':
                return actual_value != expected_value
            elif operator == "GT":
                return actual_value >= expected_value
            elif operator == 'LT':
                return actual_value <= expected_value
            return False
        
          
    def get_all_resources_for_category(self,project_name, category):
    
     
        category_dir = f"configurations/{project_name}/{category.lower()}"
       
        try:
         
            if not os.path.isdir(category_dir):
                raise FileNotFoundError(f"Category directory '{category_dir}' does not exist.")

            # List all files in the category directory
            all_files = os.listdir(category_dir)

            resources = []
            for file_name in all_files:
                if file_name.endswith('.json') and not file_name.endswith('_versions.json'):
                    # Extract the base name without the file extension
                    resource_name = file_name.split('.',1)[0]
                    resources.append(resource_name)
               
                    
            return resources

        except Exception as e:
            print(f"Error retrieving resources for category '{category}': {str(e)}")
            return []
        
    def apply_order(self, data , order_by, order_direction):
        if order_by:
            try:
                sorted_data = sorted(data, key=lambda x: x.get(order_by), reverse=(order_direction == 'desc'))
                return sorted_data
            except KeyError:
                print(f"Error: Key '{order_by}' not found in data for ordering.")
        return data
    
    def apply_limit_offset(self, data , limit=None, offset= None):
        if offset is not None:
                data = data[offset:]
            
        if limit is not None:
                data = data[:limit]
            
        return data