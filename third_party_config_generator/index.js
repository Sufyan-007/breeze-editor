const config_generator = require('./src/config_generator');
const { getLibraryProcessStatus } = require('./src/helper');
const packageInstaller = require('./src/package_installer')


// const lib = 'react-bootstrap'
// const storePath = '/home/raj/Desktop/bridge/processor/third_party_configs'

function generate_config(libraryName, libVersion, storePath){
    console.log('Process Strated for ', libraryName);
    config_generator.generator_function(libraryName, libVersion, storePath)
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
      const installationResult = packageInstaller.installPackage(libName, libVersion);

      // Get the process status of library
      // If we have already successfully processed it then we dont need to process it again
      const processStatus = getLibraryProcessStatus(libName, installationResult['version'], storePath)

      // Check if it is already successfully processed
      if(!processStatus || processStatus.status != 'SUCCESS'){
        
        console.log(`LIBRARY NEED TO BE PROCESSED, CURRENT STATUS : ${processStatus?.status}`);

        // Generate configs for the library
        generate_config(libName, installationResult['version'], storePath);
      }
      else{
        console.log('LIBRARY ALREADY PROCESSED')
      }
    }
  }

// generate_config(lib, storePath)
