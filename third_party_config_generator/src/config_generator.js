const fs = require('fs');
const path = require('path');
const { Project, Node, Symbol, TypeParameter, Type, UnionTypeNode } = require('ts-morph');
const { SyntaxKind } = require('typescript');
// Use this (handlePropTypes) for original code, decodePropType is only for easy debugging
const { HandlePropTypes } = require('./handle_prop_types');
const { DecodePropType } = require('./decodePropTypes');
const { handleConfigFileGeneration } = require('./store_config');
const { getAppRootDir, findTypeDefinitionFile, findTypeScriptEntryPoint, getFileContent, writeJsonFile, getKeyForProcessStatus, getAbsoluteStorageDirForLib } = require('./helper');
const { INDEX_FILE_NAME } = require('./consts');

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
                module: exportDec.getModuleSpecifierValue() || sourceFile.getFilePath(),
                isAbsoluteModulePath : !exportDec.getModuleSpecifierValue(), // If no moduleSpecifier found, then it will be current file
                importType: expVar['isTypeOnly'] ? 'TYPE' : expVar['name'] == 'default' ? 'DEFAULT' : 'UNKNOWN',
                exportType: exportDec.isTypeOnly() ? 'TYPE' : 'UNKNOWN',
                name: expVar['name'] == 'default' ? expVar['alias'] : expVar['name']
            }

            exports.push(expConfig)
        }
    }


    // check for default export symbol
    const defaultExportSymbol = sourceFile.getDefaultExportSymbol()

    if (defaultExportSymbol) {
        const expConfig = {
            module: defaultExportSymbol.getAliasedSymbol().getValueDeclaration().getSourceFile().getFilePath(),
            defaultExport: true,
            isAbsoluteModulePath: true,
            importType: defaultExportSymbol.getImmediatelyAliasedSymbol().getDeclarations()[0].isTypeOnly() ? 'TYPE' :
                defaultExportSymbol.getImmediatelyAliasedSymbol().getDeclarations()[0].getDefaultImport() ? 'DEFAULT' : 'UNKNOWN',
            exportType: 'DEFAULT',
            name: defaultExportSymbol.getAliasedSymbol().getName(),
            currentFileName: defaultExportSymbol.getImmediatelyAliasedSymbol().getName()
        }
        exports.push(expConfig)


    }

    const exportedKeys = exports.map(exp => exp.name);

    for (let [expKey, exportedVar] of sourceFile.getExportedDeclarations()) {
        if (isAlreadyInExpList(exportedKeys, expKey)) {
            continue;
        }
            
            const expConfig = {
                module: exportedVar[0].getSourceFile().getFilePath(),
                defaultExport: expKey === 'default',
                isAbsoluteModulePath: true,
                importType: exportedVar[0].isDefaultExport() ? 'DEFAULT' : 'UNKNOWN',
                exportType: 'UNKNOWN',
                name: exportedVar[0].getName(),
                exportedName: expKey,
                currentFileName: sourceFile.getFilePath()
            }
            exports.push(expConfig)

    }

    // sourceFile.forEachDescendant(node => {
    //     if (node.getKindName() === 'ExportDeclaration') {
    //         console.log('Ers');
    //         // if (node.getDefaultExportSymbol) {
    //         //     const namedExports = node.getNamedExports();
    //         //     namedExports.forEach(namedExport => {
    //         //         exports.push(namedExport.getText());
    //         //     });
    //         // } else if (node.isDefaultExport()) {
    //         //     const defaultExport = node.getDefaultExportSymbol();
    //         //     if (defaultExport) {
    //         //         exports.push(defaultExport.getName());
    //         //     }
    //         // }
    //     }
    // });

    return exports;
}

function isAlreadyInExpList(exports, expKey) {
    return exports.includes(expKey);
}

// Process exports variable
function processExports(project, entryPoint, exportsConfig, libraryPath, libInfo) {

    // console.log(exportsConfig.length);
    // exportsConfig = exportsConfig.slice(205, 206)
    const expList = exportsConfig
    const errors = [];
    for (const expConfig of expList) {
        try {

            const typeDefinitionFile = expConfig['isAbsoluteModulePath'] ? expConfig['module'] : findTypeDefinitionFile(entryPoint, expConfig['module'], libraryPath);

            // If not able to find the source file for the variable, 
            // then continue processing next var
            if (!typeDefinitionFile) {
                continue;
            }

            const sourceFile = project.addSourceFileAtPath(typeDefinitionFile);

            if (checkIfReactImported(sourceFile)) {
                sourceFile.insertStatements(0, `import * as React from 'react';`);
            }

            // If it is imported as default variable from file then try to read the default variable of the file
            // if (expConfig['importType'] == 'DEFAULT') {
            let exportVarSymbol;

            if (expConfig['importType'] == 'DEFAULT') {

                exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol() || sourceFile.getDefaultExportSymbol();
            } else {
                exportVarSymbol = getDeclarationOfProps(expConfig['name'], sourceFile)
                if(exportVarSymbol){
                    exportVarSymbol = exportVarSymbol.getSymbol() || exportVarSymbol;
                }

            }

            if(!exportVarSymbol) {
                console.log('ExportVarSymbol is None');    
                continue
            };

            // Need to think about this, maybe change the approach of reading attributes
            const attributesOfVar = getDeclaration(exportVarSymbol)?.getType().getProperties() ?? exportVarSymbol.getType().getProperties();
            let isComponent;

            // If declared Like,
            // declare const _default: typeof DataTable;
            // export default _default;
            if (attributesOfVar.length == 0 && (exportVarSymbol instanceof Symbol)) {
                const symbol = getDeclaration(exportVarSymbol).getType().getSymbol()

                if (symbol) {
                    const isFunctionDeclaration = symbol.getValueDeclaration()?.getKind() == SyntaxKind.FunctionDeclaration;
                    if (isFunctionDeclaration) {
                        isComponent = isReturnJSX(symbol.getValueDeclaration());
                    }

                }
            } else {

                // Determine if it is component or not
                isComponent = checkIfComponentType(attributesOfVar)
            }

            expConfig['isComponent'] = isComponent

            // Add props if it is component
            if (isComponent) {
                expConfig['props'] = []
                const propsList = getPropsForDefaultExportVar(sourceFile, expConfig['name'], libInfo, expConfig['importType'] == 'DEFAULT')
                expConfig['props'] = propsList
            }
            // }

            // const varOfFile = sourceFile.getExportAssignments()
            // // // console.log(sourceFile.getDefaultExportSymbol().getEscapedName());


            // // // console.log(sourceFile.getDefaultExportSymbol().getExportSymbol().getEscapedName());
            // // // console.log(sourceFile.getDefaultExportSymbol().getAliasedSymbol().getValueDeclaration().getChildren());


        } catch (error) {
            console.log('-----ERROR_IN_PROCESS_EXPORTS-----', expConfig['name']);
            errors.push({
                errorLog: error.stack,
                name: expConfig['name'],
                config: expConfig
            })
            // console.log(error);
        }
    }

    return errors;

}

function getDefaultExportVariableDeclaration(sourceFile) {
    const defaultExportDec = sourceFile.getDefaultExportSymbol().getAliasedSymbol()?.getValueDeclaration() ||
        sourceFile.getDefaultExportSymbol().getValueDeclaration()
        ;

    if (defaultExportDec.getType().getSymbol()?.getValueDeclaration()) {
        return defaultExportDec.getType().getSymbol().getValueDeclaration();
    }

    return defaultExportDec;

}

function getDeclaration(symbol) {


    if (!(symbol instanceof Symbol)) {
        return;
    }

    if (symbol.getValueDeclaration()) return symbol.getValueDeclaration()

    if (symbol.getDeclarations().length > 0) {
        return symbol.getDeclarations()[0]
    }
}

function getVariableDeclarationForExport(sourceFile, name) {
    const dec = getDeclarationOfProps(name, sourceFile);

    if (dec.getType().getSymbol()?.getValueDeclaration()) {
        return dec.getType().getSymbol().getValueDeclaration();
    }

    return dec;



}

function isReturnJSX(functionDeclaration) {
    // Add this to also check if it is return type jsx, react_jsx_runtime.JSX.Element
    return functionDeclaration.getReturnType().getText() == 'JSX.Element';
}

function getPropsForDefaultExportVar(sourceFile, componentName, libInfo, isDefaultExport = true) {

    const handlePropTypes = new HandlePropTypes(libInfo);
    const propsReader = new PropsReader(libInfo);

    let defaultExportDec;

    if (isDefaultExport) {
        defaultExportDec = getDefaultExportVariableDeclaration(sourceFile);
    } else {
        // Handle case for the exports that are not default exported
        defaultExportDec = getVariableDeclarationForExport(sourceFile, componentName);
    }

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
        if (defaultExportDec.getParameters().length > 0) {

            propVarName = defaultExportDec.getParameters()[0].getTypeNode().getText();

            const propVarRef = defaultExportDec.getParameters()[0].getTypeNode()
            propList = propsReader.processProps(propVarRef)
        } else {
            propList = [];
        }
        // propList = propsReader.getPropsList(propVarName, sourceFile)

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
                propList = propsReader.processProps(relatedCallSign.getParameters()[0].getTypeNode())

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
                        referenceToPropsVar = getPropRef(referenceToPropsVar) ;
                        // console.log(referenceToPropsVar);
                    }
                    // console.log(variableDeclaration.getType().getTypeArguments().map(t => t.getSymbol()?.getName()));
                }


                for (const ta of referenceToPropsVar.getTypeArguments()) {
                    // console.log(ta.getText());


                    if(ta instanceof Type){
                        const tempListOfProps = ta.getProperties();

                        propList = propList.concat(tempListOfProps.map(prop => ({
                            name: prop.getName(),
                            type: getDeclaration(prop).getType().getText(),
                            raw: getDeclaration(prop).getType().getText(),
                            isOptional: prop.isOptional(),
                            fullData: handlePropTypes.handleProps(prop, getDeclaration(prop).getTypeNode())
                        })));
                    }
                    else if (ta.getKind() == SyntaxKind.TypeReference) {
                        // console.log(ta.getType().getProperties());
                        // // console.log('ssss',ta.getTypeName().getText());
                        // if (ta.getTypeArguments().length > 0) {
                        //     propVarName = ta.getTypeName().getText();
                        // } else {

                        //     propVarName = ta.getText();
                        // }

                        // // console.log('sdf', propVarName);
                        // if (!propVarName) {
                        //     propVarName = `${componentName}Props`
                        // }

                        // propList = propsReader.getPropsList(propVarName, sourceFile)

                        propList = propsReader.processProps(ta)
                        break;
                    }
                    else if (ta.getKind() == SyntaxKind.IntersectionType) {
                        for (const subType of ta.getTypeNodes()) {

                            const subTypeRef = getPropRef(subType)
                            // If true then its simple interface like ImageProps
                            if (subTypeRef.getTypeArguments().length == 0) {
                                // propList = propList.concat(propsReader.getPropsList(subTypeRef.getText(), sourceFile))
                                propList = propList.concat(propsReader.processProps(subTypeRef))

                            } else { // Else it is like React.RefAttributes<HTMLElement> so it has type arugments
                                const tempListOfProps = subType.getType().getProperties();

                                propList = propList.concat(tempListOfProps.map(prop => ({
                                    name: prop.getName(),
                                    type: prop.getValueDeclaration().getType().getText(),
                                    raw: prop.getValueDeclaration().getType().getText(),
                                    isOptional: prop.isOptional(),
                                    fullData: handlePropTypes.handleProps(prop, prop.getValueDeclaration().getTypeNode())
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

function getPropRef(typeNodeReference){
    if(typeNodeReference.getKind() == SyntaxKind.IntersectionType){
         for(const typeNode of typeNodeReference.getTypeNodes() ){
            if(typeNode.getKind() == SyntaxKind.TypeQuery){
                return getPropRef(typeNode);                
            }else if(typeNode.getKind() == SyntaxKind.TypeReference){
                return typeNode.getType();
            }else if(typeNode.getKind() == SyntaxKind.ImportType){
                return typeNode.getType();
            }
         }
    }else if(typeNodeReference.getKind() == SyntaxKind.TypeQuery){
        if(typeNodeReference.getType().getTypeArguments().length > 0){
            return typeNodeReference.getType();
        }

        return typeNodeReference;
    }else if(typeNodeReference.getKind() == SyntaxKind.ParenthesizedType){
        return getPropRef(typeNodeReference.getTypeNode());
    }else if(typeNodeReference.getKind() == SyntaxKind.UnionType){
        return getPropRef(typeNodeReference.getTypeNodes()[0])
    }

    return typeNodeReference;
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

function checkIfReactImported(sourceFile) {
    const reactImport = sourceFile.getImportDeclarations().find(declaration => {
        const defaultImport = declaration.getDefaultImport();
        const moduleSpecifier = declaration.getModuleSpecifierValue();
        return defaultImport?.getText() === 'React' && moduleSpecifier === 'react';
    });


    return !!reactImport;
}

function getTypeReferenceOfComponentVar(variableNode) {
    if (variableNode.getKind() == SyntaxKind.IntersectionType) {
        for (const subProp of variableNode.getTypeNodes()) {

            if (subProp.getKind() == SyntaxKind.TypeReference) {
                return subProp;
            }else if(subProp.getKind() == SyntaxKind.TypeQuery){
                return subProp;
            }else if(subProp.getKind() == SyntaxKind.ImportType){
                return subProp.getType();
            }
        }

    } else if (variableNode.getKind() == SyntaxKind.TypeReference) {
        return variableNode
    }

    return variableNode
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

                const relatedSourceFile = typeNode.getTypeNodes()[0].getSourceFile() || sourceFile;

                if ((typeof typeNode.getTypeNodes()[0].getTypeArguments == 'function') && typeNode.getTypeNodes()[0].getTypeArguments().length > 0) {

                    if (typeNode.getTypeNodes()[0].getTypeArguments().length > 0) {
                        return getDeclarationOfProps(typeNode.getTypeNodes()[0].getTypeName().getText(), sourceFile)
                    } else {
                        return typeNode.getTypeNodes()
                    }
                } else if (
                    Node.isLiteralTypeNode(typeNode.getTypeNodes()[0]) ||
                    Node.isExpression(typeNode.getTypeNodes()[0]) ||
                    Node.isArrayTypeNode(typeNode.getTypeNodes()[0]) ||
                    Node.isParenthesizedTypeNode(typeNode.getTypeNodes()[0]
                    )) {
                    return typeNode.getTypeNodes()[0]
                } else if ((typeof typeNode.getTypeNodes()[0].getType == 'function' &&
                    typeNode.getTypeNodes()[0].getType() instanceof TypeParameter) ||
                    typeNode.getTypeNodes()[0].getKind() == SyntaxKind.IndexedAccessType
                ) {
                    return typeNode.getTypeNodes()[0]
                }
                // else if(typeNode.getTypeNodes()[0].getKind() == SyntaxKind.IndexedAccessType)
                // console.log(typeNode.getTypeNodes()[0].getTypeName())
                return getDeclarationOfProps(typeNode.getTypeNodes()[0].getText(),  relatedSourceFile)
            } else if (typeNode.getKind() == SyntaxKind.IntersectionType) {
                return typeNode;
            } else if (typeNode.getKind() == SyntaxKind.TupleType) {
                return typeNode;
            } else {
                return typeNode;
            }
        }
    }

    // Check if the the imported from another file
    if (!propVar) {
        // // // console.log('000000000000');
        // // // // console.log(sourceFile.getImportDeclarations()[1].getStructure().namedImports);
        const relatedImport = sourceFile.getImportDeclaration(i => i.getNamedImports().find(n => n.getName() === propName))
        // // // // console.log(relatedImport.getNamedImports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]);
        propVar = relatedImport?.getNamedImports().find(n => n.getName() === propName)?.getNameNode().getDefinitionNodes()[0];
    }

    // Check if the variable is in import like, import * as colors from 'module'
    if (!propVar){
        const relatedImport = sourceFile.getImportDeclaration(i => i.getStructure().namespaceImport === propName);
        propVar = relatedImport?.getNamespaceImport();
    }


    if (!propVar) {
        // Try to find the variable which is written like
        // export type { AnchorProps }; and it's imported from other file
        // Other way can be we can search for imports
        const relatedExportDeclaration = sourceFile.getExportDeclaration(d => d.getNamedExports().find(n => n.getName() === propName));

        propVar = relatedExportDeclaration?.getNamedExports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]

    }

    // Check if it is function
    if (!propVar) {
        propVar = sourceFile.getFunctions().find(f => f.getName() === propName);
    }

    // Check for namespaces or modules declared
    if (!propVar) {
        propVar = sourceFile.getModule(propName);
    }

    if(!propVar){
        propVar = sourceFile.getClass(propName);
    }

    if (!propVar) {
        propVar = sourceFile.getVariableDeclaration(propName);
    }



    // // // console.log('FINAL', propVar);
    return propVar
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

class PropsReader {
    constructor(libInfo) {
        this.libraryName = libInfo.libName;
        this.libVersion = libInfo.libVersion;
        this.storePath = libInfo.storePath;

        this.handlePropTypes = new HandlePropTypes(libInfo);

    }

    processProps(referenceVar) {
        // // console.log(referenceVar.getType().getProperties());
        const props = referenceVar.getType().getProperties();
        const propsList = [];
        // // console.log(propsList.length);
        for (const pr of props) {

            const declaration = getDeclaration(pr);

            propsList.push(this.getSinglePropObject(declaration || pr));

        }

        return propsList;

    }


    // Get propsList from the prop variable 
    getPropsList(propName, sourceFile) {
        // console.log(propName);
        const propVar = getDeclarationOfProps(propName, sourceFile)

        const propsList = []

        if (propVar) {
            for (const prop of propVar.getProperties()) {
                propsList.push(this.getSinglePropObject(prop))
            }
        }

        // console.log(propsList);

        return propsList;

    }

    // Handle 
    handleSymbolProps(prop) {
        return {
            name: prop.getName(),
            type: prop.getDeclaredType().getText(),
            raw: prop.getDeclaredType().getText(),
            isOptional: prop.isOptional(),
            isSymbolTypeProp: true,
            fullData: this.handlePropTypes.handleProps(prop, prop.getDeclaredType())
        }
    }

    // Prepare and return details for single prop of the component
    getSinglePropObject(prop) {


        try {

            let typeConfig;

            let isTypeNodeAvailable;

            // Handle scenario when it is of symbol type
            // We dont have access to certain props when its symbol type
            if (prop.constructor.name == 'Symbol') {
                return this.handleSymbolProps(prop)
            }

            if (prop.getKind() == SyntaxKind.MethodSignature || (!prop.getTypeNode())) {
                typeConfig = prop.getType()
                isTypeNodeAvailable = false;
            } else {
                isTypeNodeAvailable = true;
                typeConfig = prop.getTypeNode()

                if (typeConfig.getKind() != SyntaxKind.UnionType) {
                    typeConfig = typeConfig.getType()
                }
            }

            const propConfig = {
                name: prop.getName(),
                type: prop.getType().getText(),
                raw: isTypeNodeAvailable ? prop.getTypeNode().getText() : prop.getType().getText(),
                isOptional: prop.getSymbol().isOptional(),
                fullData: this.handlePropTypes.handleProps(prop, typeConfig)
            }

            return propConfig;

        } catch (error) {
            console.log('EEEEE', error);
            throw error;
            // console.log(error);
        }
        // // console.log('----', prop.getTypeNode().getType().isUnion(), prop.getType().getText());
    }






}

function generator_function(libName, libVersion, storePath) {


    const libInfo = {
        libName,
        libVersion,
        storePath
    }

    const dirOfProject = getAppRootDir()

    const libSrcCodePath = path.join(dirOfProject, 'node_modules', libName);

    const project = new Project();

    const entryPoint = findTypeScriptEntryPoint(libSrcCodePath);
    const entryPointPath = path.join(libSrcCodePath, entryPoint);

    // Get exports from the file
    const exports = readExportsFromTypeScriptFile(project, entryPointPath);
    // console.log(exports);

    // Process exports variable and get detailed config
    const result = processExports(project, entryPoint, exports, libSrcCodePath, libInfo)
    // fs.writeFileSync(`${libraryName}_exports.json`, JSON.stringify(exports));

    // console.log(exports);
    // Create files for export variables with configuration
    handleConfigFileGeneration(exports, getAbsoluteStorageDirForLib(libInfo), libName)

    // Store the status of the process
    storeIndexFileInfo(libInfo, result)
}


// Stores the processing status information
function storeIndexFileInfo(libInfo, errors) {

    // Get the content of the processing status file
    const indexFilePath = `${libInfo.storePath}/${INDEX_FILE_NAME}`
    let indexFile = getFileContent(indexFilePath);
    indexFile = JSON.parse(indexFile);

    // Get key using which the status is stored
    const key = getKeyForProcessStatus(libInfo.libName, libInfo.libVersion);

    indexFile[key] = {}

    // If there are errors while processing mark it as partial success
    if (errors.length > 0) {
        indexFile[key] = {
            status: 'PARTIAL',
            errors: errors
        }
    } else {
        indexFile[key] = {
            status: 'SUCCESS'
        }
    }

    // Write config
    writeJsonFile(indexFile, indexFilePath);

}

module.exports = {
    generator_function
}