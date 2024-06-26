const { generator_function } = require('./config_generator')

const storePath = '/home/raj/Desktop/bridge/processor/third_party_configs'

const allLibraries = [
    {
        lib: '@chakra-ui/react',
        libVersion: '2.8.2',
        storePath: storePath
    },
    {
        lib: '@mui/material',
        libVersion: '5.15.20',
        storePath: storePath
    },
    {
        lib: 'react-bootstrap',
        libVersion: '2.10.2',
        storePath: storePath
    },
    {
        lib: 'antd',
        libVersion: '5.18.0',
        storePath: storePath
    },
    {
        lib: 'semantic-ui-react',
        libVersion: '2.1.5',
        storePath: storePath
    },
    {
        lib: 'react-data-table-component',
        libVersion: '7.6.2',
        storePath: storePath
    },
    {
        lib : '@headlessui/react',
        libVersion : '2.1.0',
        storePath : storePath
    },
    {
        lib : 'grommet',
        libVersion : '2.38.0',
        storePath : storePath
    }
]

const libraries = [allLibraries[7]];

const tester_function = () => {
    for (const lib of libraries) {
        generator_function(lib.lib, lib.libVersion, lib.storePath)
    }
}

tester_function();
