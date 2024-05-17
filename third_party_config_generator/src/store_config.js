const fs = require('fs');

function handleConfigFileGeneration(exports, storePath, libraryName) {
    const folderPath = storePath;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    exports.forEach(item => {
        const fileName = item.isComponent ? `component_${item.name}.json` : `other_${item.name}.json`;
        const filePath = `${folderPath}/${fileName}`;
        const fileContent = item.isComponent ? getDefaultConfig(item, libraryName) : item;

        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 4));
    });
}


function getDefaultConfig(config, libName) {
    return {
        "name": config['name'],
        "$id": `${libName}.${config['name']}`,
        "library": libName,
        "importName": config['name'],
        "containingFile": config['module'],
        "stateVars": [],
        "propsVars": config['props'],
        "otherVars": [],
        "functions": [],
        "html": {},
        "imports": {
            "components": [
            ],
            "other": [
            ]
        },
        "hooks": [],
        // "metadata": config
    }
}


module.exports = {
    handleConfigFileGeneration
}
