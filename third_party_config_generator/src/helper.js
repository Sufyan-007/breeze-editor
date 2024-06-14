const fs = require('fs');
const path = require('path');
const { INDEX_FILE_NAME } = require('./consts');

function getAppRootDir() {
    let currentDir = __dirname
    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.join(currentDir, '..')
    }
    return currentDir
}

function findTypeScriptEntryPoint(libraryPath) {
    const packageJsonPath = path.join(libraryPath, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.types || packageJson.typings;
}

function findTypeDefinitionFile(entryPoint, moduleSpecifier, libraryPath) {
    const modulePath = path.join(libraryPath, path.dirname(entryPoint), moduleSpecifier);
    
    let typeDefinitionFile;
    if(fs.existsSync(modulePath) && fs.lstatSync(modulePath).isDirectory()){
        typeDefinitionFile = `${modulePath}/index.d.ts`; 


        // Check if it is referencing /dist/index.d.ts file if index.d.ts doesn't 
        // exists directly
        if(!fs.existsSync(typeDefinitionFile) && fs.existsSync(`${modulePath}/dist`) && fs.lstatSync(`${modulePath}/dist`).isDirectory()){
            typeDefinitionFile = `${modulePath}/dist/index.d.ts`;
        }
        
    }else{
        typeDefinitionFile = `${modulePath}.d.ts`;
    }
    // // console.log(typeDefinitionFile);
    return fs.existsSync(typeDefinitionFile) ? typeDefinitionFile : null;
}

function replaceSlashWithUnderscore(str) {
    return str.replace(/\//g, '@@@');
}

function sanitizeFilePath(filepath) {
    return replaceSlashWithUnderscore(removePathTillNodeModule(filepath))
}

function removePathTillNodeModule(str) {
    return str.replace(/.*\/node_modules\//, "");
}

const fileDir = "/home/raj/Desktop/bridge/npm_libraries/conf_generator/third_party_configs/react-bootstrap/others"


function createDirectoryIfNotExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Directory "${directory}" created.`);
    } else {
        // console.log(`Directory "${directory}" already exists.`);
    }
}

function createFileIfNotExists(filePath, initialData) {
    if (fs.existsSync(filePath)) {
        console.log("File exists")
    }
    else {
        console.log('INITIAL DATA ', initialData);
        fs.writeFileSync(filePath, initialData, (err) => {
            if (err) throw err;
            console.log('File created successfully.');
          });

        console.log("File does not exist")
    }

}

function getFileContent(filePath, createIfNotExists=true, initialData = '{}') {
    if(createIfNotExists){
        createFileIfNotExists(filePath, initialData);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
}


function storeInfo(info, fileInfo, storageDir) {

    const fileDir = `${storageDir}/others`
    createDirectoryIfNotExists(fileDir);

    // const folderPath = storePath;
    // if (!fs.existsSync(folderPath)) {
    //     fs.mkdirSync(folderPath);
    // }
    // info = {
    //     ...info,
    //     refVariable: fileI
    // }
    // info['refVariable'] = fileInfo['refVariable']
    // info['refPath'] = fileInfo['refPath']

    fs.writeFileSync(`${fileDir}/${fileInfo['refVariable']}`, JSON.stringify({
        ...info,
        refVariable: fileInfo['refVariable'], 
        refPath : fileInfo['refPath']
    }, null, 4));

}

function writeJsonFile(content, filePath){
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
}

function getLibraryProcessStatus(libName, libVersion, storePath){
    const indexFilePath = `${storePath}/${INDEX_FILE_NAME}`
    let indexFile = getFileContent(indexFilePath);
    indexFile = JSON.parse(indexFile);

    const libKey = getKeyForProcessStatus(libName, libVersion)

    return  indexFile[libKey]

}

function getKeyForProcessStatus(libName, libVersion){
    if(!libVersion) return libName

    return `${libName}@${libVersion}`
}

function getAbsoluteStorageDirForLib(libInfo){
    return `${libInfo.storePath}/${libInfo.libName}_${libInfo.libVersion}` ;
}

module.exports = {
    getAppRootDir,
    findTypeDefinitionFile,
    findTypeScriptEntryPoint,
    replaceSlashWithUnderscore,
    storeInfo,
    sanitizeFilePath,
    getFileContent,
    writeJsonFile,
    getLibraryProcessStatus,
    getKeyForProcessStatus,
    getAbsoluteStorageDirForLib
}
