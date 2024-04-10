const fs = require('fs');
const path = require('path');
const { Project, SourceFile, TypeGuards } = require('ts-morph');
const { SyntaxKind } = require('typescript');


function getAppRootDir () {
    let currentDir = __dirname
    while(!fs.existsSync(path.join(currentDir, 'package.json'))) {
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
    console.log(typeDefinitionFile);
    return fs.existsSync(typeDefinitionFile) ? typeDefinitionFile : null;
}

function readExportsFromTypeScriptFile(project, filePath) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const exports = [];

    const exportDeclarations = sourceFile.getExportDeclarations();
    // console.log(sourceFile.getExport);

    for (const exportDec of exportDeclarations) {

        const exp = exportDec.getStructure()
        // console.log(exp.getType(), exp.getNamedExports(), exp.getStructure());
        // console.log(exp['namedExports']);
        for (const expVar of exp['namedExports']) {

            const expConfig = {
                module: exportDec.getModuleSpecifierValue(),
                importType: expVar['isTypeOnly'] ? 'TYPE' : expVar['name'] == 'default' ? 'DEFAULT' : 'UNKNOWN',
                exportType: exportDec.isTypeOnly() ? 'TYPE' : 'UNKNOWN',
                name: expVar['name'] == 'default' ? expVar['alias'] : expVar['name']
            }

            exports.push(expConfig)
        }
    }


    sourceFile.forEachDescendant(node => {
        if (node.getKindName() === 'ExportDeclaration') {
            // if (node.getDefaultExportSymbol) {
            //     const namedExports = node.getNamedExports();
            //     namedExports.forEach(namedExport => {
            //         exports.push(namedExport.getText());
            //     });
            // } else if (node.isDefaultExport()) {
            //     const defaultExport = node.getDefaultExportSymbol();
            //     if (defaultExport) {
            //         exports.push(defaultExport.getName());
            //     }
            // }
        }
    });

    return exports;
}


function processExports(project, entryPoint, exportsConfig, libraryPath) {

    const expList = exportsConfig
    for (expConfig of expList) {
        try {

            const typeDefinitionFile = findTypeDefinitionFile(entryPoint, expConfig['module'], libraryPath);
            // console.log(typeDefinitionFile);
            if (!typeDefinitionFile) {
                continue;
            }

            // const typeDefinitionContent = fs.readFileSync(typeDefinitionFile, 'utf-8');
            const sourceFile = project.addSourceFileAtPath(typeDefinitionFile);

            console.log(expConfig['name']);


            // If it is imported as default variable from file then try to read the default variable of the file
            if (expConfig['importType'] == 'DEFAULT') {

                const exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol()
                const exportVarName = exportVarSymbol.getName()

                const attributesOfVar = sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration().getType().getProperties()


                const isComponent = checkIfComponentType(attributesOfVar)

                console.log("IS_COMPONENT", isComponent);
                // if(isComponent) {
                expConfig['isComponent'] = isComponent

                // Add props if it is component
                if (isComponent) {
                    const propsList = getPropsForDefaultExportVar(sourceFile, expConfig['name'])
                    expConfig['props'] = propsList
                }
                // }
                // const attributesOfVar = 

            }

            // const varOfFile = sourceFile.getExportAssignments()
            // console.log(sourceFile.getExportedDeclarations());
            // console.log(sourceFile.getExportDeclarations());
            // console.log(sourceFile.getExportSymbols());
            // console.log(sourceFile.getDefaultExportSymbol().getEscapedName());
            // console.log(sourceFile.getDefaultExportSymbol().isAlias());


            // console.log(sourceFile.getDefaultExportSymbol().getExportSymbol().getEscapedName());
            // console.log(sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration().getChildren());

            // console.log('---');





            // console.log(varOfFile);
            // for( const v of varOfFile){
            // console.log(v.getStructure());
            // }
            // console.log(sourceFile.getVariableDeclarations());



        } catch (error) {
            console.log(error);
        }
    }

}
// function getType()

function getPropsForDefaultExportVar(sourceFile, componentName) {
    // This gets the children of default export var
    // ex. AccordionCollapse : BsPrefixRefForwardingComponent<'div', AccordionCollapseProps>
    // Here there will be three children
    // AccordionCollapse
    // :
    // BsPrefixRefForwardingComponent<'div', AccordionCollapseProps>
    // So we need to check the last one it can be of type TypeReference or IntersectionType
    // IntersectionType will be only there when it is like  BsPrefixRefForwardingComponent<'div', AccordionCollapseProps> & {}
    const childrenOfDefaultExportVar = sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration().getChildren()

    let propVarName = null;

    for (const ch of childrenOfDefaultExportVar) {
        // console.log(ch);
        // console.log(ch.getKind() == SyntaxKind.IntersectionType);
        console.log(ch.getText());

        if (ch.getKind() == SyntaxKind.IntersectionType || ch.getKind() == SyntaxKind.TypeReference) {

            // This is the variable which is reference to the props variable for this component
            // Which will be generally the last children in above for loop 
            const referenceToPropsVar = getTypeReferenceOfComponentVar(ch)
            // Here this also can be used for checking if its component or not
            // console.log(subProp.getTypeName().getText());

            // console.log(subProp.getTypeArguments());

            for (const ta of referenceToPropsVar.getTypeArguments()) {
                // console.log(ta.getText());
                if (ta.getKind() == SyntaxKind.TypeReference) {
                    // console.log(ta.getType().getProperties());
                    // processProps(ta)
                    propVarName = ta.getText();
                    console.log(propVarName);
                    break;
                }
            }
        }
        // console.log('=====');
    }

    // If not able to find the props variable name for the component simply add the Props to the component name
    // This is temparory because all cases need to be handled
    if (!propVarName) {
        propVarName = `${componentName}Props`
    }

    return getPropsList(propVarName, sourceFile)

}

function getTypeReferenceOfComponentVar(variableNode) {
    if (variableNode.getKind() == SyntaxKind.IntersectionType) {
        for (const subProp of variableNode.getTypeNodes()) {

            if (subProp.getKind() == SyntaxKind.TypeReference) {
                return subProp;
            }
        }

    } else if (variableNode.getKind() == SyntaxKind.TypeReference) {
        return variableNode
    }

    return variableNode
}

function getPropsList(propName, sourceFile) {
    const interfaceDecl = sourceFile.getInterface(propName)
    // console.log(interfaceDecl.getProperties());

    const propsList = []

    console.log(propName, sourceFile.getInterfaces());

    for (const prop of interfaceDecl.getProperties()) {
        // console.log(prop.getName(), prop.getType().getText(), prop.getSymbol().isOptional());
        propsList.push({
            name: prop.getName(),
            type: prop.getType().getText(),
            isOptional: prop.getSymbol().isOptional()
        })
    }

    console.log(propsList);

    return propsList;

}

function processProps(referenceVar) {
    console.log(referenceVar.getType().getProperties());
    const propsList = referenceVar.getType().getProperties();

    console.log(propsList.length);
    // for( const pr of propsList){
    //     console.log(pr.getName());
    // }

}

function checkIfComponentType(properties) {
    // let isComp = false

    for (const prop of properties) {
        // console.log(TypeGuards.isObjectType(prop));
        // console.log(prop.getValueDeclaration().getChildren());
        // console.log(prop.getDeclaredType().getProperties());
        // console.log(prop.getValueDeclaration().print());
        if (prop.getName() == 'propTypes') {

            // console.log(prop);
            return true
        }
    }

    return false
}

function handleConfigFileGeneration(exports, storePath) {
    const folderPath = storePath;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    exports.forEach(item => {
        const fileName = item.isComponent ? `component_${item.name}.json` : `other_${item.name}.json`;
        const filePath = `${folderPath}/${fileName}`;
        const fileContent = item.isComponent ? getDefaultConfig(item) : item;
    
        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 4));
    });
}

function generator_function(libraryName, storePath) {

    const dirOfProject = getAppRootDir()

    const libraryPath = path.join(dirOfProject, 'node_modules', libraryName);

    const project = new Project();

    const entryPoint = findTypeScriptEntryPoint(libraryPath);
    const entryPointPath = path.join(libraryPath, entryPoint);

    const exports = readExportsFromTypeScriptFile(project, entryPointPath);
    // console.log(exports);


    processExports(project, entryPoint, exports, libraryPath)
    // fs.writeFileSync(`${libraryName}_exports.json`, JSON.stringify(exports));

    // console.log(exports);
    // Create file for components

    handleConfigFileGeneration(exports, `${storePath}/${libraryName}`)
    // out
}

function getDefaultConfig(config) {
    return {
        "name": config['name'],
        "$id": config['name'],
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
        "metadata" : config
    }
}

// generator_function();

// Todo:
// Need to handle the class declared component which extends React.Component<PropsVar> 
// ex. for above is AccordionBody

// Need to handle this declare const _default: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>> & {
// Where React.ForwardRefExoticComponent is used


// Need to handle the ToggleButtonGroupProps<any> TypeReference


// Check Anchor(Its imported from another package) FigureImage FOrmLabel(It's prop is type not interface) 
// NavBarOffCanvas(Type props) ToogleButtonGroup (Type props)

// need to handle type of prop like boolean should be converted to our project type boolean so it can 
// be in same format

// need to define path where the config should be generated and 
// id of the component and containingFile should be added properly 
// configure details that can be useful when we want to import it in cretaed project so test it

module.exports = {
    generator_function
}