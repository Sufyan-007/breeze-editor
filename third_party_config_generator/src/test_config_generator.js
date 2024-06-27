const { generator_function } = require('./config_generator')

const storePath = '/home/raj/Desktop/bridge/processor/third_party_configs'

const allLibraries = [
    //0
    {
        lib: '@chakra-ui/react',
        libVersion: '2.8.2',
        storePath: storePath
    },
    //1
    {
        lib: '@mui/material',
        libVersion: '5.15.20',
        storePath: storePath
    },
    //2
    {
        lib: 'react-bootstrap',
        libVersion: '2.10.2',
        storePath: storePath
    },
    //3
    {
        lib: 'antd',
        libVersion: '5.18.0',
        storePath: storePath
    },
    //4
    {
        lib: 'semantic-ui-react',
        libVersion: '2.1.5',
        storePath: storePath
    },
    //5
    {
        lib: 'react-data-table-component',
        libVersion: '7.6.2',
        storePath: storePath
    },
    //6
    {
        lib : '@headlessui/react',
        libVersion : '2.1.0',
        storePath : storePath
    },
    //7
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
