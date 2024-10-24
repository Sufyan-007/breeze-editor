from dataclasses import dataclass
from .....descriptor import ApplyValidation
@dataclass
class AddRouteBody:
    path : str = ApplyValidation()
    componentId : str = ApplyValidation()
    children : list[str] = ApplyValidation()
    parentId : str = ApplyValidation()
    props : str = ApplyValidation()
    redirectTo : str = ApplyValidation()
    hydrateFallbackElementId : str = ApplyValidation()
    errorElementId : str = ApplyValidation()
    loader : str = ApplyValidation()
    lazy : str = ApplyValidation()
    action : str = ApplyValidation()
    shouldRevalidate : str = ApplyValidation()
    caseSensitive : str = ApplyValidation()
    index : str = ApplyValidation()
    
@dataclass
class UpdateRouteBody:
    path : str = ApplyValidation()
    componentId : str = ApplyValidation()
    id : str = ApplyValidation()
    
@dataclass
class DeleteRouteBody:
    id : str = ApplyValidation()