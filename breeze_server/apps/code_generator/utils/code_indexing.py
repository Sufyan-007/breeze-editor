import re

def find_ignore_whitespace(target, query):
    # Remove all whitespaces in target and query to search effectively
    def clean_text(text):
        text = text.replace("'", '"')  # Replace double quotes with single quotes
        text = text.replace(';', '')   # Remove semicolons
        text = text.replace('(', '')   # Remove semicolons
        text = text.replace(')', '')   # Remove semicolons
        text = text.replace(',', '')   # Remove semicolons
        text = re.sub(r'[\s\r\n]+', '', text)  # Remove all whitespace and newline
        return text

    cleaned_target = clean_text(target)
    cleaned_query = clean_text(query)
    
    match = re.search(re.escape(cleaned_query), cleaned_target)
    
    if not match:
        raise IndexError("No match found ") 
    
    start_index_cleaned = match.start()
    end_index_cleaned = match.end()

    
    original_indices = []
    cleaned_idx = 0
    
    for original_idx, char in enumerate(target):
        if not char.isspace() and char!="\n" and char!=";" and char!=")" and char!="(" and char!=",":
            if cleaned_idx == start_index_cleaned:

                original_indices.append(original_idx)
            if cleaned_idx == end_index_cleaned - 1:
                original_indices.append(original_idx)
                break
            cleaned_idx += 1
            
    return original_indices



class CodeIndexing:
    def __init__(self,start,end):
        self.start= start
        self.end = end
    
    def __contains__(self,val):
        if type(val) is int:
            return self.start<=val and self.end>=val
        elif type(val) is tuple or type(val) is list:
            return self.start<=val[0] and self.end>=val[1]
        
    def __eq__(self,other):
        return self.start == other.start and self.end == other.end
    
    def __hash__(self):
        return hash(str(self.start)+"_"+str(self.end))
    
    def __str__(self):
        return "Index Object - "+str(self.start)+" - "+str(self.end)

class CodeTree:
    
    def __init__(self):
        self.codes ={}
        pass
    
    def insertElem(self,start,end, obj):
        if self[start] and self[end]:
            raise KeyError
        
        key = CodeIndexing(start,end)
        self.codes[key] = obj
        return key
    
    def __getitem__(self,index):
        for x in self.codes:
            if index in x:
                obj = self.codes[x]
                children = obj.get("children")
                if type(children) is CodeTree:
                    x = children[index-x.start]
                    if x:
                        return x
                return obj
        return None
    
    def __iter__(self):
        return self.codes.values().__iter__()
    
    
    def __call__(self):
        print("Goodbye")
    
    def __contains__(self,val):
        for x in self.codes:
            if val in x:
                return True
        return False
    




def get_code_index(statements,code):
    tree=CodeTree()
    for statement in statements:
        if statement:
            indexes = find_ignore_whitespace(code,statement["code"])
            if len(indexes) !=2:
                continue
            children = statement.get("children")
            if indexes ==None:
                raise Exception()
            
            obj = {k:statement[k] for k in statement if k in ["id","type"] }
            if children:
                childCode= code[indexes[0]:indexes[1]+1]
                obj["children"] = get_code_index(children,childCode)
            tree.insertElem(indexes[0],indexes[1],obj)
    return tree