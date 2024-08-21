
from app_basic_config import AppBasicConfig
from function_config import FunctionConfig
from typing import Dict


class StateVars:
    # The name of the state variable.
    name : str
    
    # The type of the state variable.
    type : str
    
    # The default value of the state variable.
    defaultValue : any
    
    # The unique identifier for the state variable.
    id : str
    
class PropsVars:
    # The name of the prop variable.
    name : str
    
    # The unique identifier for the prop variable.
    id : str
   

class OtherVars:
    # The name of the other variable.
    name : str
    
    # The unique identifier for the other variable.
    id : str
    
    # The class name associated with the other variable.
    className : str
    
    # The parameters associated with the other variable.
    parameters : 'list[str]'
    
    # The declaration type of the other variable.
    declarationType : str

class HtmlElements:
    # The type of the HTML element. Can be 'Element' for HTML elements or 'text' for text nodes.
    type : str
    
    # The text content of the HTML element. This is only applicable for text nodes.
    text : str
    
    # The type of the HTML element. This is 'HTML' for HTML elements.
    elementType : str
    
    # The tag name of the HTML element.
    tagName : str
    
    # The attributes of the HTML element. This is a dictionary where each key is an attribute name and the value is another dictionary with 'type' and 'value' keys.
    attributes : dict
    
    # The children of the HTML element. This is a list of other Html objects.
    children : 'list[Html]'

class Html:
    # The unique identifier for the HTML element of the component.
    id : str
    
class ImportOther:
    # The type of the source being imported from. Can be "ThirdParty" for third-party libraries or "Service" for local service files.
    TYPE : str
    
    # The source module or package from which the entity or style is being imported.
    From : str
    
    # The specific entity (module, function, object, etc.) that is being imported from the source.
    import_entity : str
    
    # The type of import being performed. Can be "FULL" for importing an entire module/package, or "SINGLE" for importing a specific entity from a module/package.
    import_type : str
    
class Styles:
    # The type of the style being imported. Can be "userDefined css" for custom styles or "thirdParty css" for third-party styles.
    TYPE : str
    
    # The source module or package from which the entity or style is being imported.
    From : str
    
    # The specific entity (style object, styled component, etc.) that is being imported from the source.
    import_entity : str
    
    # The type of import being performed. Can be "FULL" for importing an entire CSS file, "MODULE" for importing a CSS module, or "SINGLE" for importing a specific styled component.
    import_type : str
    
class Import:
    # list of components which are imported in this component.
    components : 'list[str]'
    
    # list of third party components which are imported in this component.
    other : 'list[ImportOther]'
    
    # list of styles which are imported in this component.
    styles : 'list[Styles]'

class Hooks:
    
    #type can be one of these :- useState, useEffect, useReducer, useContext, useRef, useImperativeHandle, useLayoutEffect, useMemo, useCallback
    type : str
    
    #if some hooks typ are useEffect, useMemo, useCallback then it is required as dependency array.
    #list of dependant variables.
    dependantVars : 'list[str]'
    
    # The implementation of the hook. This is a dictionary with 'type' and '$ref' keys. 'type' can be "FUNCTION" and '$ref' is a reference to the function implementing the hook.
    implementations : dict
    



class ComponentConfig:
    # The name of the component.
    name : str
    
    # The unique identifier for the component.
    id : str
    
    # The file path where the component is located.
    containingFile : str
    
    # If component declared a state varaible using useState hook then its is required otherwise not.
    stateVars : 'list[StateVars]'
    
    # if component takes props from parent component then it is required otherwise not.
    propsVars : 'list[PropsVars]'
    
    # if component takes other variables than props and state then it is required otherwise not.
    otherVars : 'list[OtherVars]'
    
    # List of functions defined in the component.
    functions : 'list[FunctionConfig]'
    
    # The HTML element of the component. This is a dictionary with '_id' key which refers to the  element in the 'html_elements' dictionary.
    html:Html
        
    # The wrapper store of the component.
    wrapper_store : None
    
    # The imports used in the component.
    imports:Import
        
    # List of hooks used in the component.
    hooks : 'list[Hooks]'
    
    # A dictionary of all HTML elements used in the component. The keys are the element ids and the values are dictionaries describing the elements.
    html_elements : Dict[str, HtmlElements] 
    
    