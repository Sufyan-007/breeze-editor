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
                    expConfig['props'] = []
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

    const defaultExportDec = sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration()

    // This gets the children of default export var
    // ex. AccordionCollapse : BsPrefixRefForwardingComponent<'div', AccordionCollapseProps>
    // Here there will be three children
    // AccordionCollapse
    // :
    // BsPrefixRefForwardingComponent<'div', AccordionCollapseProps>
    // So we need to check the last one it can be of type TypeReference or IntersectionType
    // IntersectionType will be only there when it is like  BsPrefixRefForwardingComponent<'div', AccordionCollapseProps> & {}
    const childrenOfDefaultExportVar = defaultExportDec.getChildren()

    let propVarName = null;
    let propList = [];

    if(defaultExportDec.getKind() == SyntaxKind.FunctionDeclaration){
        console.log('FUNCTION DECLARATION FOUND FOR COMPONENT');
        // This will handle case like where component is declared like this
        // declare function ThemeProvider({ prefixes, children, }: ThemeProviderProps): JSX.Element;
        console.log('Getting parameter type for finding the propType variable');
        console.log(defaultExportDec.getParameters()[0].getTypeNode().getText());
        propVarName =  defaultExportDec.getParameters()[0].getTypeNode().getText();
        propList = getPropsList(propVarName, sourceFile)

    }
    else{
        for (const ch of childrenOfDefaultExportVar) {
            // console.log(ch);
            // console.log(ch.getKind() == SyntaxKind.IntersectionType);
            console.log(ch.getText());
            
            // This will handle the case when the component is directly defined
            // declare const TabContainer: {
            // }
            if(ch.getKind() == SyntaxKind.TypeLiteral){
                console.log('TYPE LITERAL FOUND');
                // console.log(ch.getCallSignature(cs => cs.getReturnType().getText() == 'JSX.Element'));
                const relatedCallSign = ch.getCallSignature(cs => cs.getReturnType().getText() == 'JSX.Element')
                console.log(relatedCallSign.getParameters().map(p => p.getStructure().type));
                // This gets the type reference to the props type
                console.log(relatedCallSign.getParameters()[0].getTypeNode().getText());
                propVarName = relatedCallSign.getParameters()[0].getTypeNode().getText();
                propList = getPropsList(propVarName, sourceFile)
    
                // console.log(relatedCallSign.getSignature().getParameters().map(t => t.getStructure()));
                // console.log(ch.getCallSignatures().map(cs => cs.getReturnTypeNode().getText()));
                // console.log(ch.getConstructSignatures().map(p => p.getReturnType()));
            }

            else if (ch.getKind() == SyntaxKind.IntersectionType || ch.getKind() == SyntaxKind.TypeReference) {
    
                // This is the variable which is reference to the props variable for this component
                // Which will be generally the last children in above for loop 
                const referenceToPropsVar = getTypeReferenceOfComponentVar(ch)
                // Here this also can be used for checking if its component or not
                // console.log(subProp.getTypeName().getText());
    
                // console.log(subProp.getTypeArguments());

                // This will happend when its not directly assigned
                // ex. declare const DropdownToggle: DropdownToggleComponent;
                // Here variable is assigned as the value of some variable
                // It's not directly like DropdownToggle: BsPrefixComponent<'div', PropsVar> 
                if(referenceToPropsVar.getTypeArguments().length == 0){
                    console.log('Variable Assigned');
                    // console.log(referenceToPropsVar.getTypeAlias().getTypeNode().getText());
                    const variableName = referenceToPropsVar.getType().getText();
    
                    console.log(variableName);
                    if(sourceFile.getTypeAlias(variableName)){
    
                        referenceToPropsVar = sourceFile.getTypeAlias(variableName).getTypeNode();
                        console.log(referenceToPropsVar);
                    }
                    // console.log(variableDeclaration.getType().getTypeArguments().map(t => t.getSymbol()?.getName()));
                }

                
                for (const ta of referenceToPropsVar.getTypeArguments()) {
                    // console.log(ta.getText());
                    if (ta.getKind() == SyntaxKind.TypeReference) {
                        // console.log(ta.getType().getProperties());
                        // processProps(ta)
                        console.log('ssss',ta.getTypeName().getText());
                        if(ta.getTypeArguments().length > 0){
                            propVarName = ta.getTypeName().getText();
                        }else{
    
                            propVarName = ta.getText();
                        }
                        
                        console.log('sdf', propVarName);
                        if (!propVarName) {
                            propVarName = `${componentName}Props`
                        }
                    
                        propList = getPropsList(propVarName, sourceFile)
                        break;                    
                    }
                    else if(ta.getKind() == SyntaxKind.IntersectionType){
                        for (const subType of ta.getTypeNodes()){
    
                            // If true then its simple interface like ImageProps
                            if(subType.getTypeArguments().length == 0){
                                propList = propList.concat(getPropsList(subType.getText(), sourceFile))
    
                            }else{ // Else it is like React.RefAttributes<HTMLElement> so it has type arugments
                                const tempListOfProps = subType.getType().getProperties();
                                
                                // We still need to handle the Union type like string | null | undefined 
                                // for(const tp of tempListOfProps){
                                //     // console.log(tp.getName());
                                //     // // console.log(tp);
                                //     // // console.log(tp.getValueDeclaration());
                                //     // // console.log(tp.getValueDeclaration().getType().getText());
                                //     // console.log(tp.getValueDeclaration().getType().isUnionOrIntersection());
                                // }
                                propList = propList.concat(tempListOfProps.map(prop => ({
                                    name : prop.getName(),
                                    type : prop.getValueDeclaration().getType().getText(), 
                                    isOptional : prop.isOptional()
                                })));
                            }
                            // // console.log('***', subType.getKindName(), subType.getText(), subType.getTypeArguments());
                            // if (subType.getText() == 'React.RefAttributes<HTMLImageElement>'){
    
                            //     // console.log(subType.getKindName());
                            //     for (const prop of subType.getType().getProperties()){
                            //         // console.log(prop.getName());
                            //     }
                            // }
                        }

                    }
                }
            }
            // console.log('=====');
        }
    }

    // If not able to find the props variable name for the component simply add the Props to the component name
    // This is temparory because all cases need to be handled
    // if (!propVarName) {
    //     propVarName = `${componentName}Props`
    // }

    console.log('----------List of Props-----------\n', propList);


    return propList;

}

function combineIntersectionProps(intersectionVar){

    for (const subType of ta.getTypeNodes()){
        // console.log('***', subType.getText());
        if (subType.getText() == 'React.RefAttributes<HTMLImageElement>'){

            // console.log(subType.getType().getProperties());
            for (const prop of subType.getType().getProperties()){
                // console.log(prop.getName());
            }
        }
    }

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

function getSinglePropObject(prop){
    return {
        name: prop.getName(),
        type: prop.getType().getText(),
        raw : prop.getTypeNode().getText(),
        isOptional: prop.getSymbol().isOptional()
    }
}

function getPropsList(propName, sourceFile) {
    // console.log(propName);
    const propVar = getDeclarationOfProps(propName, sourceFile)
    // let propVar = sourceFile.getInterface(propName)
    

    // // console.log(propVar.getProperties());

    const propsList = []

    // console.log(propVar, sourceFile.getInterfaces());

    if( propVar){

        for (const prop of propVar.getProperties()) {
            console.log(prop.getStructure().type);
            // console.log(prop.getName(), prop.getType().getText(), prop.getSymbol().isOptional());
            propsList.push(getSinglePropObject(prop))
        }
    }

    // console.log(propsList);

    // Try to find the 
    // propVar = sourceFile.getTypeLiteral(propName)
    // // console.log(propVar);

    // Try to find the variable which is written like
    // export type { AnchorProps }; and it's imported from other file
    // Other way can be we can search for imports
    // const relatedExportDeclaration = sourceFile.getExportDeclaration(d => d.getNamedExports().find(n => n.getName() === "AnchorProps"));

    // propVar = relatedExportDeclaration.getNamedExports().find(n => n.getName() === "AnchorProps").getNameNode().getDefinitionNodes()[0]
    
    // .getDefinitionNodes()[0];
    // // console.log(propVar);

    // // console.log(sourceFile.getExportDeclarations()[0].getNamedExports()[0].getNameNode().getDefinitionNodes()[0].getProperties());

    // if( propVar){

    //     for (const prop of propVar.getProperties()) {
    //         // // console.log(prop.getName(), prop.getType().getText(), prop.getSymbol().isOptional());
    //         propsList.push({
    //             name: prop.getName(),
    //             type: prop.getType().getText(),
    //             isOptional: prop.getSymbol().isOptional()
    //         })
    //     }

    //     // console.log(propsList);

    //     return propsList;
    // }


    return propsList;
    

}

// This function returns InterfaceDeclaration type of object
function getDeclarationOfProps(propName, sourceFile){
    let propVar = sourceFile.getInterface(propName)

    console.log(propName);

    // Get declared type variable
    if(!propVar){
        console.log(sourceFile.getTypeAlias(propName).getTypeNode());
        const typeNode = sourceFile.getTypeAlias(propName).getTypeNode()
        if(typeNode){
            if(typeNode.getKind() == SyntaxKind.UnionType){
                console.log('UNION TYPE NODE');
                console.log(typeNode.getTypeNodes().map(t => t.getText()));
                // NEED to handle all the type of union type : REFER FORM LABEL
                // Temporarily returing one 
                if(typeNode.getTypeNodes()[0].getTypeArguments().length > 0){
                    return getDeclarationOfProps(typeNode.getTypeNodes()[0].getTypeName().getText(), sourceFile)
                }
                // console.log(typeNode.getTypeNodes()[0].getTypeName())
                return getDeclarationOfProps(typeNode.getTypeNodes()[0].getText(), sourceFile)
            }
        }
    }

    // Check if the the interface is imported from another file
    if(!propVar){
        // console.log('000000000000');
        // // console.log(sourceFile.getImportDeclarations()[1].getStructure().namedImports);
        const relatedImport = sourceFile.getImportDeclaration(i => i.getNamedImports().find(n => n.getName() === propName))
        // // console.log(relatedImport.getNamedImports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]);
        propVar = relatedImport?.getNamedImports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0];
    }

    if(!propVar){
            // Try to find the variable which is written like
    // export type { AnchorProps }; and it's imported from other file
    // Other way can be we can search for imports
        const relatedExportDeclaration = sourceFile.getExportDeclaration(d => d.getNamedExports().find(n => n.getName() === propName));
        
        propVar = relatedExportDeclaration?.getNamedExports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]

    }

    console.log('FINAL', propVar);
    return propVar
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

    handleConfigFileGeneration(exports, `${storePath}/${libraryName}`, libraryName)
    // out
}

function getDefaultConfig(config, libName) {
    return {
        "name": config['name'],
        "$id": `${libName}.${config['name']}`,
        "library": libName,
        "importName" : config['name'],
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

// NavBarOffCanvas(Type props) ToogleButtonGroup (Type props)

// id of the component and containingFile should be added properly 
// configure details that can be useful when we want to import it in cretaed project so test it

module.exports = {
    generator_function
}