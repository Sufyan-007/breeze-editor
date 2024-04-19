class Route:
    path : str

    ####OPTIONAL####
    # If component is provided for the route then redirectTo is not required
    # It redirect to the given url when the current path is hit
    redirectTo: str 

    ####OPTIONAL####
    action: dict

    ####OPTIONAL####
    loader : dict

    ####OPTIONAL####
    component:  str

    ####OPTIONAL####
    errorElement: str

    ####OPTIONAL####
    hydrateFallbackElement : str


class RoutingConfig:

    routes: 'list[Route]'