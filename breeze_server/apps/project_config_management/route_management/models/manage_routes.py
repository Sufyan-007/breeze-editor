from dataclasses import dataclass
from descriptor import ApplyValidation
from validator import required_validator
@dataclass
class AddRouteBody:
    path : str = ApplyValidation([required_validator])
    componentId : str = ApplyValidation([required_validator])
    children : list[str] = ApplyValidation([])
    parentId : str = ApplyValidation([])
    props : str = ApplyValidation([])
    redirectTo : str = ApplyValidation([])
    hydrateFallbackElementId : str = ApplyValidation([])
    errorElementId : str = ApplyValidation([])
    loader : str = ApplyValidation([])
    lazy : str = ApplyValidation([])
    action : str = ApplyValidation([])
    shouldRevalidate : str = ApplyValidation([])
    caseSensitive : str = ApplyValidation([])
    index : str = ApplyValidation([])
    
@dataclass
class UpdateRouteBody:
    path : str = ApplyValidation([required_validator])
    componentId : str = ApplyValidation([required_validator])
    id : str = ApplyValidation([required_validator])
    
@dataclass
class DeleteRouteBody:
    id : str = ApplyValidation([required_validator])
    
@dataclass
class GetAllChildRoutesResponse:
    nodes = ApplyValidation([])

@dataclass
class GetAllRoutesFullPathResponse:
    nodes = ApplyValidation([])
    
@dataclass
class AddRouteResponse:
    config_data = ApplyValidation([])

@dataclass
class UpdateRouteResponse:
    config_data  = ApplyValidation([])
    
@dataclass
class DeleteRouteResponse:
    config_data = ApplyValidation([])
    