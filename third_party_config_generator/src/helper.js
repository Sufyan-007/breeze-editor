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


module.exports = {
    getAppRootDir,
    findTypeDefinitionFile,
    findTypeScriptEntryPoint
}
