const config_generator = require('./src/config_generator')
const packageInstaller = require('./src/package_installer')


// const lib = 'react-bootstrap'
// const storePath = '/home/raj/Desktop/bridge/processor/third_party_configs'

function generate_config(libraryName, storePath){
    console.log('Process Strated for ', libraryName);
    config_generator.generator_function(libraryName, storePath)
    return 'Process Completed'
}

// console.log(process.argv);
if (process.argv.length >= 3) {
    const functionName = process.argv[2];
    
    // Call the specified function with additional arguments if provided
    if (functionName === "generate_config" && process.argv.length >= 4) {
      const libName = process.argv[3]
      const libVersion = process.argv[4]
      const storePath = process.argv[5]
      // Try to install library
      packageInstaller.installPackage(libName, libVersion);

      // Generate configs for the library
      // generate_config(libName, storePath);
    }
  }

// generate_config(lib, storePath)
