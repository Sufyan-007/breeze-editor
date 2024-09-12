import os
import json
import operator
from common.utils.app_consts import CONFIG_PATH
from common.utils.file_helper_temp import read_json_file

class QueryResourceService:
    def __init__(self,project_name):
        self.project_name = project_name
        self.config_path = os.path.join(CONFIG_PATH, project_name) 
        
    def get_json_config_data(self,resource,category):
        try:
           config_data = read_json_file(self.project_name, category.lower(),resource,version="latest")
           return config_data
        except Exception as e:
           print(f"Error loading JSON config: {str(e)}")
           return None
    
    def apply_filter(self, data, resource, filter_criteria, select):
        print(select, "select")
        operation = filter_criteria.get('operation', 'ALL')
        print(operation, "operation")
        
        conditions = filter_criteria.get('conditions', [])
        print(conditions, "condition")

        # Parsing the conditions
        parsed_conditions = [self.parse_condition(cond) for cond in conditions]
        
        # Apply filter based on operation
        filtered_data = None
        if operation == "ANY":
            if any(self.check_condition(data, cond, resource) for cond in parsed_conditions):
                filtered_data = data  # Return the original data if any condition matches
        elif operation == "ALL":
            if all(self.check_condition(data, cond, resource) for cond in parsed_conditions):
                filtered_data = data  # Return the original data if all conditions match

        # If no filtering applied or no conditions satisfied, return None or the original data
        if filtered_data is None:
            return None

        # If select is provided, filter the fields
        if select:
            print("inside select")
            selected_data = {}
            # Loop through the select array to get specified fields
            for key in select:
                if key in filtered_data['data'][resource]:
                    selected_data[key] = filtered_data['data'][resource][key]
            
            print(selected_data, "selected data")
            return selected_data  # Return selected fields in the desired format

        # Return the full filtered data if no select is specified
        return filtered_data

    
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

            # print(key,"key",operator,"operator",expected_value,"expected value")
            
            # Splitting the key to handle nested attributes (e.g., 'Main.name')
            keys = key.split('.')
            actual_value = data.get('data', {}).get(resource, {}) 
            
            # Traverse the data dictionary using the keys
            for k in keys:
                # print(k,"kkkkkkkkk")
                actual_value = actual_value.get(k)
                if actual_value is None:
                    break  
            
            # print(actual_value,"actual value")
            
            if operator == 'EQ':
                return actual_value == expected_value
            elif operator == 'NEQ':
                return actual_value != expected_value
            elif operator == "GT":
                return actual_value >= expected_value
            elif operator == 'LT':
                return actual_value <= expected_value
            return False
        
          