const fs = require('fs');
const path = require('path');
const { Project } = require('ts-morph');
const { SyntaxKind } = require('typescript');
// Use this (handlePropTypes) for original code, decodePropType is only for easy debugging
const { handlePropTypes } = require('./handle_prop_types');
const { decodePropType } = require('./decodePropTypes');
const { handleConfigFileGeneration } = require('./store_config');
const { getAppRootDir, findTypeDefinitionFile, findTypeScriptEntryPoint } = require('./helper');

// Returns export variables from given file path
function readExportsFromTypeScriptFile(project, filePath) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const exports = [];

    const exportDeclarations = sourceFile.getExportDeclarations();
    // // // console.log(sourceFile.getExport);

    for (const exportDec of exportDeclarations) {

        const exp = exportDec.getStructure()
        // // // console.log(exp.getType(), exp.getNamedExports(), exp.getStructure());
        // // // console.log(exp['namedExports']);
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

// Process exports variable
function processExports(project, entryPoint, exportsConfig, libraryPath) {

    // console.log(exportsConfig.length);
    // exportsConfig = exportsConfig.slice(0, 1)
    expList = exportsConfig
    for (expConfig of expList) {
        try {

            const typeDefinitionFile = findTypeDefinitionFile(entryPoint, expConfig['module'], libraryPath);

            // If not able to find the source file for the variable, 
            // then continue processing next var
            if (!typeDefinitionFile) {
                continue;
            }

            const sourceFile = project.addSourceFileAtPath(typeDefinitionFile);

            // If it is imported as default variable from file then try to read the default variable of the file
            if (expConfig['importType'] == 'DEFAULT') {

                const exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol()

                const attributesOfVar = exportVarSymbol.getValueDeclaration().getType().getProperties()
                
                // Determine if it is component or not
                const isComponent = checkIfComponentType(attributesOfVar)
                expConfig['isComponent'] = isComponent

                // Add props if it is component
                if (isComponent) {
                    expConfig['props'] = []
                    const propsList = getPropsForDefaultExportVar(sourceFile, expConfig['name'])
                    expConfig['props'] = propsList
                }
            }

            // const varOfFile = sourceFile.getExportAssignments()
            // // // console.log(sourceFile.getDefaultExportSymbol().getEscapedName());


            // // // console.log(sourceFile.getDefaultExportSymbol().getExportSymbol().getEscapedName());
            // // // console.log(sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration().getChildren());


        } catch (error) {
            console.log('-----ERROR_IN_PROCESS_EXPORTS-----');
            // console.log(error);
        }
    }

}

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

    if (defaultExportDec.getKind() == SyntaxKind.FunctionDeclaration) {
        // // console.log('FUNCTION DECLARATION FOUND FOR COMPONENT');
        // This will handle case like where component is declared like this
        // declare function ThemeProvider({ prefixes, children, }: ThemeProviderProps): JSX.Element;
        // // // console.log('Getting parameter type for finding the propType variable');
        // // // console.log(defaultExportDec.getParameters()[0].getTypeNode().getText());
        propVarName = defaultExportDec.getParameters()[0].getTypeNode().getText();
        propList = getPropsList(propVarName, sourceFile)

    }
    else {
        for (const ch of childrenOfDefaultExportVar) {
            // // // console.log(ch);
            // // // console.log(ch.getKind() == SyntaxKind.IntersectionType);
            // // // console.log(ch.getText());

            // This will handle the case when the component is directly defined
            // declare const TabContainer: {
            // }
            if (ch.getKind() == SyntaxKind.TypeLiteral) {
                // // // console.log('TYPE LITERAL FOUND');
                // // // console.log(ch.getCallSignature(cs => cs.getReturnType().getText() == 'JSX.Element'));
                const relatedCallSign = ch.getCallSignature(cs => cs.getReturnType().getText() == 'JSX.Element')
                // // // console.log(relatedCallSign.getParameters().map(p => p.getStructure().type));
                // This gets the type reference to the props type
                // // // console.log(relatedCallSign.getParameters()[0].getTypeNode().getText());
                propVarName = relatedCallSign.getParameters()[0].getTypeNode().getText();
                propList = getPropsList(propVarName, sourceFile)

                // // // console.log(relatedCallSign.getSignature().getParameters().map(t => t.getStructure()));
                // // // console.log(ch.getCallSignatures().map(cs => cs.getReturnTypeNode().getText()));
                // // // console.log(ch.getConstructSignatures().map(p => p.getReturnType()));
            }

            else if (ch.getKind() == SyntaxKind.IntersectionType || ch.getKind() == SyntaxKind.TypeReference) {

                // This is the variable which is reference to the props variable for this component
                // Which will be generally the last children in above for loop 
                let referenceToPropsVar = getTypeReferenceOfComponentVar(ch)
                // Here this also can be used for checking if its component or not
                // console.log(subProp.getTypeName().getText());

                // This will happend when its not directly assigned
                // ex. declare const DropdownToggle: DropdownToggleComponent;
                // Here variable is assigned as the value of some variable
                // It's not directly like DropdownToggle: BsPrefixComponent<'div', PropsVar> 
                if (referenceToPropsVar.getTypeArguments().length == 0) {
                    // console.log(referenceToPropsVar.getTypeAlias().getTypeNode().getText());
                    const variableName = referenceToPropsVar.getType().getText();

                    // console.log(variableName);
                    if (sourceFile.getTypeAlias(variableName)) {

                        referenceToPropsVar = sourceFile.getTypeAlias(variableName).getTypeNode();
                        // console.log(referenceToPropsVar);
                    }
                    // console.log(variableDeclaration.getType().getTypeArguments().map(t => t.getSymbol()?.getName()));
                }


                for (const ta of referenceToPropsVar.getTypeArguments()) {
                    // console.log(ta.getText());
                    if (ta.getKind() == SyntaxKind.TypeReference) {
                        // console.log(ta.getType().getProperties());
                        // processProps(ta)
                        // console.log('ssss',ta.getTypeName().getText());
                        if (ta.getTypeArguments().length > 0) {
                            propVarName = ta.getTypeName().getText();
                        } else {

                            propVarName = ta.getText();
                        }

                        // console.log('sdf', propVarName);
                        if (!propVarName) {
                            propVarName = `${componentName}Props`
                        }

                        propList = getPropsList(propVarName, sourceFile)
                        break;
                    }
                    else if (ta.getKind() == SyntaxKind.IntersectionType) {
                        for (const subType of ta.getTypeNodes()) {

                            // If true then its simple interface like ImageProps
                            if (subType.getTypeArguments().length == 0) {
                                propList = propList.concat(getPropsList(subType.getText(), sourceFile))

                            } else { // Else it is like React.RefAttributes<HTMLElement> so it has type arugments
                                const tempListOfProps = subType.getType().getProperties();

                                // for(const tp of tempListOfProps){
                                    // console.log(tp.getValueDeclaration().getType().getText());
                                // }

                                propList = propList.concat(tempListOfProps.map(prop => ({
                                    name: prop.getName(),
                                    type: prop.getValueDeclaration().getType().getText(),
                                    raw: prop.getValueDeclaration().getType().getText(),
                                    isOptional: prop.isOptional(),
                                    fullData: decodePropType(prop, prop.getValueDeclaration().getTypeNode())
                                })));
                            }
                        }

                    }
                }
            }
        }
    }

    // console.log('----------List of Props-----------\n', propList);

    return propList;

}

function combineIntersectionProps(intersectionVar) {

    for (const subType of ta.getTypeNodes()) {
        // // // console.log('***', subType.getText());
        if (subType.getText() == 'React.RefAttributes<HTMLImageElement>') {

            // // // console.log(subType.getType().getProperties());
            for (const prop of subType.getType().getProperties()) {
                // // // console.log(prop.getName());
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

// Prepare and return details for single prop of the component
function getSinglePropObject(prop) {
    try {
        const propConfig = {
            name: prop.getName(),
            type: prop.getType().getText(),
            raw: prop.getTypeNode().getText(),
            isOptional: prop.getSymbol().isOptional(),
            fullData: decodePropType(prop, prop.getTypeNode().getType())
        }


        return propConfig;

    } catch (error) {
        console.log('EEEEE');
        // console.log(error);
    }
    // // console.log('----', prop.getTypeNode().getType().isUnion(), prop.getType().getText());
}

// Get propsList from the prop variable 
function getPropsList(propName, sourceFile) {
    // console.log(propName);
    const propVar = getDeclarationOfProps(propName, sourceFile)

    const propsList = []

    if (propVar) {
        for (const prop of propVar.getProperties()) {
            propsList.push(getSinglePropObject(prop))
        }
    }

    // console.log(propsList);

    return propsList;

}

// This function returns InterfaceDeclaration type of object
function getDeclarationOfProps(propName, sourceFile) {
    let propVar = sourceFile.getInterface(propName)

    // console.log(propName);
    // console.log(propVar);

    // Get declared type variable
    if (!propVar) {
        // // // console.log(sourceFile.getTypeAlias(propName).getTypeNode());
        const typeNode = sourceFile.getTypeAlias(propName)?.getTypeNode()
        if (typeNode) {
            if (typeNode.getKind() == SyntaxKind.UnionType) {
                // console.log('UNION TYPE NODE');
                // console.log(typeNode.getTypeNodes().map(t => t.getText()));
                // NEED to handle all the type of union type : REFER FORM LABEL
                // Temporarily returing one 
                if (typeNode.getTypeNodes()[0].getTypeArguments().length > 0) {
                    return getDeclarationOfProps(typeNode.getTypeNodes()[0].getTypeName().getText(), sourceFile)
                }
                // console.log(typeNode.getTypeNodes()[0].getTypeName())
                return getDeclarationOfProps(typeNode.getTypeNodes()[0].getText(), sourceFile)
            }
        }
    }

    // Check if the the interface is imported from another file
    if (!propVar) {
        // // // console.log('000000000000');
        // // // // console.log(sourceFile.getImportDeclarations()[1].getStructure().namedImports);
        const relatedImport = sourceFile.getImportDeclaration(i => i.getNamedImports().find(n => n.getName() === propName))
        // // // // console.log(relatedImport.getNamedImports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]);
        propVar = relatedImport?.getNamedImports().find(n => n.getName() === propName)?.getNameNode().getDefinitionNodes()[0];
    }

    if (!propVar) {
        // Try to find the variable which is written like
        // export type { AnchorProps }; and it's imported from other file
        // Other way can be we can search for imports
        const relatedExportDeclaration = sourceFile.getExportDeclaration(d => d.getNamedExports().find(n => n.getName() === propName));

        propVar = relatedExportDeclaration?.getNamedExports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]

    }

    // // // console.log('FINAL', propVar);
    return propVar
}


function processProps(referenceVar) {
    // // console.log(referenceVar.getType().getProperties());
    const propsList = referenceVar.getType().getProperties();

    // // console.log(propsList.length);
    // for( const pr of propsList){
    //     // // console.log(pr.getName());
    // }

}

// Check if it is component by going through all the properties of the variable or class or object
function checkIfComponentType(properties) {

    for (const prop of properties) {
        if (prop.getName() == 'propTypes') {
            return true
        }
    }

    return false
}

function generator_function(libraryName, storePath) {

    const dirOfProject = getAppRootDir()

    const libraryPath = path.join(dirOfProject, 'node_modules', libraryName);

    const project = new Project();

    const entryPoint = findTypeScriptEntryPoint(libraryPath);
    const entryPointPath = path.join(libraryPath, entryPoint);

    // Get exports from the file
    const exports = readExportsFromTypeScriptFile(project, entryPointPath);
    // console.log(exports);

    // Process exports variable and get detailed config
    processExports(project, entryPoint, exports, libraryPath)
    // fs.writeFileSync(`${libraryName}_exports.json`, JSON.stringify(exports));

    // console.log(exports);
    // Create file for export variable config
    handleConfigFileGeneration(exports, `${storePath}/${libraryName}`, libraryName)
}

// const lib = 'react-bootstrap'
// const storePath = '/home/raj/Desktop/bridge/npm_libraries/conf_generator/third_party_configs'

// generator_function(lib, storePath);

// Todo:

// Handle omit
// Try to find all the props
// Try to get detailed info about the prop type
// Add type of export
// configure details that can be useful when we want to import it in cretaed project so test it

module.exports = {
    generator_function
}