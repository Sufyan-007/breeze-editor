class FunctionConfig:

    # Not applied when isAnonymous is true
    name :str

    id : str

    isAnonymous: bool

    parameters : 'Parameter'

    isAsync : bool

    # Body of the function in string format
    body : str


class Parameter:

    # If it is true then parameter will be like getUserInfo({user}) 
    # If false then function getUserInfo(user)
    destructured : bool

    list : 'list[ParameterName]'


class ParameterName:
    
    name : str