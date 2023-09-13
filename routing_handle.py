import json

def generate_route_components(routes):
    route_components = ''
    for route in routes:
        route_components += f'''
            <Route exact path="{route['path']}" component={{loadable(() => import('./components/{{route['component']}}'))}} />
        '''
    return route_components

def generate_routing_code(config):
    routes = config['routes']

    routing_code = f'''
        import React from 'react';
        import {{ Route }} from 'react-router-dom';
        import loadable from '@loadable/component';

        const routes = () => (
            <>
                {generate_route_components(routes)}
            </>
        );

        export default routes;
    '''

    return routing_code


with open('route_config.json', 'r') as config_file:
    json_config = json.load(config_file)

routes = json_config['routes']
# Generate routing code
routing_code = generate_routing_code(json_config)

with open('GeneratedRoutes.js', 'w') as output_file:
    output_file.write(routing_code)