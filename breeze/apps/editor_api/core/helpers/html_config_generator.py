class HtmlConfigGenerator():
    def __init__(self):
        pass
    
    @staticmethod
    def generate_config(elem_details,id):
        if elem_details["elementType"] == "HTML":
            return {
                "type": "Element",
                "elementType": "HTML",
                "typeId": elem_details["component"]["id"],
                "tagName": elem_details["component"]["name"],
                "attributes": {
                "className": { "type": "LITERAL", "value": "" },
                "id": { "type": "LITERAL", "value": id }
                },
                "children": []
            }
        if elem_details["elementType"] == "TEXT":
            return { "type": "text", "text": elem_details["text"] }
            
        else:
            raise NotImplementedError()