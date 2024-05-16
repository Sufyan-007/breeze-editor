const fs = require('fs');
const path = require('path');

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
    const typeDefinitionFile = `${modulePath}.d.ts`;
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

module.exports = {
    getAppRootDir,
    findTypeDefinitionFile,
    findTypeScriptEntryPoint,
    replaceSlashWithUnderscore,
    storeInfo,
    sanitizeFilePath
}
