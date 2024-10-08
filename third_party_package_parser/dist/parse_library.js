"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeclarationFiles = getDeclarationFiles;
exports.extractProps = extractProps;
exports.extractPossibleChildren = extractPossibleChildren;
exports.getAllComponentNames = getAllComponentNames;
exports.install_library = install_library;
exports.getInstalledVersion = getInstalledVersion;
exports.checkForLib = checkForLib;
exports.updateLibraryStatus = updateLibraryStatus;
exports.extractAllComponentDetails = extractAllComponentDetails;
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const ts_morph_1 = require("ts-morph");
const child_process_1 = require("child_process");
const fileTypes = [".d.ts", ".js", ".ts"];
// Utility function to get all TypeScript declaration files
function getDeclarationFiles(directory) {
    const files = [];
    function traverseDirectory(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                traverseDirectory(entryPath);
            }
            else if (entry.isFile() &&
                fileTypes.some((type) => entry.name.includes(type))) {
                files.push(entryPath);
            }
        }
    }
    traverseDirectory(directory);
    return files;
}
// Function to extract all props of a component
function extractProps(type, typeChecker) {
    const props = {};
    const symbol = type.getSymbol();
    if (symbol && symbol.members) {
        symbol.members.forEach((member, key) => {
            const propType = typeChecker.typeToString(typeChecker.getTypeOfSymbolAtLocation(member, member.valueDeclaration));
            props[key.toString()] = propType;
        });
    }
    const baseTypes = type.getBaseTypes() || [];
    baseTypes.forEach((baseType) => {
        const inheritedProps = extractProps(baseType, typeChecker);
        Object.assign(props, inheritedProps);
    });
    return props;
}
// Function to extract all props of a component
function isReactElement(type, typeChecker) {
    let isReactEl = false;
    const symbol = type.getSymbol();
    if (symbol && symbol.declarations) {
        for (const dl of symbol.declarations) {
            if ((ts.isClassDeclaration(dl) || ts.isInterfaceDeclaration(dl)) &&
                (dl === null || dl === void 0 ? void 0 : dl.heritageClauses)) {
                for (const clause of dl.heritageClauses) {
                    for (const typeNode of clause.types) {
                        let name = typeNode.expression.getText();
                        if (name.includes("Component") ||
                            name.includes("React.") ||
                            name == "React.Component" ||
                            name == "Component") {
                            isReactEl = true;
                        }
                        else {
                            const baseTypes = type.getBaseTypes() || [];
                            baseTypes.forEach((baseType) => {
                                if (!isReactEl) {
                                    isReactEl = isReactElement(baseType, typeChecker);
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    return isReactEl;
}
// Function to extract possible children based on naming convention
function extractPossibleChildren(allComponentNames, parentComponentName) {
    const children = allComponentNames.filter((name) => name !== parentComponentName && name.startsWith(parentComponentName));
    return children;
}
const isReactFunctionComponent = (node, checker) => {
    // Get the signature of the function
    // Get the return type of the function
    const signature = checker.getSignatureFromDeclaration(node);
    if (!signature) {
        return false;
    }
    let foundJsx = false;
    const returnType = checker.getReturnTypeOfSignature(signature);
    if (returnType) {
        // Check if the return type is a React element
        const typeName = checker.typeToString(returnType);
        // Common type names for React components
        if (typeName === "ReactElement" ||
            typeName === "JSX.Element" ||
            typeName === "Element" ||
            typeName === "Element[]") {
            return true;
        }
        if (typeName === "any") {
            function visit(child) {
                if (ts.isJsxElement(child) ||
                    ts.isJsxSelfClosingElement(child) ||
                    ts.isJsxFragment(child)) {
                    foundJsx = true;
                }
                // Recursively visit all child nodes
                ts.forEachChild(child, visit);
            }
            if (node.body) {
                ts.forEachChild(node.body, visit);
            }
            return foundJsx;
        }
        // Optionally, check if the return type includes JSX
        return (typeName.includes("Component") ||
            typeName.includes("ReactElement") ||
            typeName.includes("JSX.Element"));
    }
    return false;
};
function findFunctionNames(node) {
    if (ts.isCallExpression(node)) {
        const functionName = getFunctionNameCall(node.expression);
        // if (functionName) {
        //    console.log("Function Name:", functionName);
        // }
    }
    ts.forEachChild(node, findFunctionNames);
}
function getFunctionNameCall(node) {
    if (ts.isIdentifier(node)) {
        return node.text;
    }
    if (ts.isPropertyAccessExpression(node)) {
        return node.name.text;
    }
    if (ts.isCallExpression(node)) {
        return getFunctionNameCall(node.expression);
    }
    return "";
}
function getFunctionName(node) {
    let name = null;
    if (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)) {
        if (node.name) {
            name = node.name.getText();
        }
    }
    else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        if (node.initializer &&
            (ts.isFunctionExpression(node.initializer) ||
                ts.isArrowFunction(node.initializer))) {
            name = node.name.getText();
        }
    }
    else if (ts.isClassDeclaration(node) && node.name) {
        name = node.name.getText();
    }
    else if (ts.isInterfaceDeclaration(node) && node.name) {
        name = node.name.getText();
    }
    if (ts.isFunctionDeclaration(node) && node.name) {
        name = node.name.getText();
    }
    if (node.parent &&
        ts.isVariableDeclaration(node.parent) &&
        ts.isIdentifier(node.parent.name)) {
        name = node.parent.name.getText();
    }
    // Handle `declare function` specifically
    if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        if (declaration && ts.isIdentifier(declaration.name)) {
            name = declaration.name.getText();
        }
    }
    if (!name) {
        name = findFunctionNames(node);
    }
    if (!name) {
        // Add more cases as needed for other node types
        let myuuid = (0, uuid_1.v4)();
        myuuid = myuuid.replace("-", "_");
        return "";
    }
    else {
        return name;
    }
}
// Function to extract component details
function extractComponentDetails(sourceFile, typeChecker, allComponentNames, library, directoryPath) {
    const componentDetails = {};
    const functionDetails = {};
    const classDetails = {};
    function visit(node) {
        let componentName;
        let type;
        const importPath = path.relative(directoryPath, sourceFile.fileName)
            .replace(/\\/g, '/')
            .replace(/\.d\.ts$/, '');
        const importPathFormatted = `${library}/${importPath}`;
        if (ts.isTypeAliasDeclaration(node)) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        }
        else if ((ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) && node.name) {
            componentName = node.name.text;
            componentName = componentName.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
            const isJsx = isReactElement(type, typeChecker);
            if (isJsx) {
                const props = extractProps(type, typeChecker);
                // Adjust import path to match 'craft.js' structure
                // Collect children components based on naming convention
                const children = extractPossibleChildren(allComponentNames, componentName);
                let myuuid = (0, uuid_1.v4)();
                myuuid = myuuid.replace(/-/g, "_");
                const _id = myuuid;
                componentDetails[componentName] = { _id, name: componentName, props, importPath: importPathFormatted, children };
            }
        }
        else if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
            let isFunctionalComponent = isReactFunctionComponent(node, typeChecker);
            if (isFunctionalComponent) {
                const parameters = node.parameters;
                let functionName = null;
                if (node.name) {
                    functionName = node.name.getText();
                }
                if (!functionName || functionName == '__function') {
                    let parentNode = node.parent;
                    functionName = getFunctionName(parentNode);
                }
                if (functionName) {
                    // let parentNode = node.parent as ts.Node
                    // if (node.parent) {
                    //     // remaining part 
                    //     // extract name of the function
                    // }
                    let formattedParams = {};
                    parameters.map(param => {
                        const name = param.name.getText();
                        const type = param.type ? param.type.getText() : 'any';
                        formattedParams[name] = type;
                    });
                    let myuuid = (0, uuid_1.v4)();
                    myuuid = myuuid.replace(/-/g, "_");
                    const _id = myuuid;
                    componentDetails[functionName] = { _id, name: functionName, props: formattedParams, importPath: importPathFormatted, children: [""] };
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return componentDetails;
}
//to get all sourceFile according to ts-morph libraray
function getTSMorphSourceFiles(files, project) {
    let sourceFiles = [];
    for (const file of files) {
        sourceFiles.push(project.addSourceFileAtPath(file));
    }
    return sourceFiles;
}
//to get all nested sourceFiles of importDeclaration
function getRecursivelySourceFilesofImport(sf, ref, processedSourceFiles, files) {
    const importsDec = sf.getImportDeclarations();
    if (!importsDec.length) {
        return;
    }
    for (const imp of importsDec) {
        const moduleSpecifierSourceFile = imp.getModuleSpecifierSourceFile();
        const moduleSpecifierName = imp.getModuleSpecifierValue();
        if (moduleSpecifierSourceFile &&
            !processedSourceFiles.includes(moduleSpecifierName)) {
            ref.push(moduleSpecifierSourceFile.compilerNode);
            files.push(moduleSpecifierSourceFile.getFilePath());
            processedSourceFiles.push(moduleSpecifierName);
            getRecursivelySourceFilesofImport(moduleSpecifierSourceFile, ref, processedSourceFiles, files);
        }
    }
    return;
}
function getSourceFileofImport(files, project) {
    //    const missedComponentName = [];
    //    const exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol() || sourceFile.getDefaultExportSymbol();
    //    const dec = getDeclaration(exportVarSymbol);
    const sourceFiles = getTSMorphSourceFiles(files, project);
    let ref = [];
    const processedSourceFiles = [];
    for (const sf of sourceFiles) {
        getRecursivelySourceFilesofImport(sf, ref, processedSourceFiles, files);
        // componentNames.push(...getAllComponentNames(ref));
        // }
    }
    return ref;
}
// Function to get all component names
function getAllComponentNames(sourceFiles) {
    const componentNames = [];
    sourceFiles.forEach((sourceFile) => {
        function visit(node) {
            if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
                node.name.text.endsWith("Props")) {
                const componentName = node.name.text.replace("Props", "");
                componentNames.push(componentName);
            }
            else if (ts.isClassDeclaration(node) && node.name) {
                const componentName = node.name.text;
                componentNames.push(componentName);
            }
            ts.forEachChild(node, visit);
        }
        visit(sourceFile);
    });
    return componentNames;
}
//function for finding storepath for storing component details
function getStoreDir() {
    let currentDir = __dirname;
    while (!fs.existsSync(path.join(currentDir, "third_party_configs"))) {
        const parentDir = path.join(currentDir, "..");
        if (currentDir === parentDir) {
            // Reached the root of the filesystem
            return null;
        }
        currentDir = parentDir;
    }
    return path.join(currentDir, 'third_party_configs');
}
function getCustomStoreDir(projName) {
    let currentDir = __dirname;
    while (!fs.existsSync(path.join(currentDir, 'breezeui'))) {
        const parentDir = path.join(currentDir, '..');
        if (currentDir === parentDir) {
            // Reached the root of the filesystem
            return null;
        }
        currentDir = parentDir;
    }
    return path.join(currentDir, `breezeui/configurations/${projName}/customized_proj_config`);
}
function createComponentDir(baseDir, type) {
    let componentDir;
    if (type === "library") {
        componentDir = path.join(baseDir);
    }
    else {
        componentDir = path.join(baseDir);
    }
    if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir);
    }
    else {
        console.log(`Component directory already exists at: ${componentDir}`);
    }
    return componentDir;
}
//install library
function install_library(libraryName, libraryVersion) {
    try {
        if (!libraryName) {
            console.error('Please provide a package name.');
            return { message: 'Please provide a package name.', technicalDetails: "", statusCode: 500 };
        }
        if (libraryVersion) {
            libraryName = `${libraryName}@${libraryVersion}`; // execSync(command, (error, stdout, stderr) => {
        }
        const command = `npm audit fix && npm install ${libraryName} --save`;
        const stdout = (0, child_process_1.execSync)(command, { stdio: 'pipe' }).toString();
        console.log(`\n---PACKAGE ${libraryName} INSTALLATION SUCCESSFUL---`);
        return {
            message: `---PACKAGE ${libraryName} INSTALLATION SUCCESSFUL---`,
            technicalDetails: "",
            statusCode: 200
        };
    }
    catch (error) {
        // Handle specific errors during package installation
        let clientMessage = `Failed to install the package "${libraryName}". Please try again later or contact support.`;
        if (error.message.includes('ENOENT')) {
            clientMessage = `Command not found: npm might not be installed or is not in the PATH.`;
            // statusCode = 404; // Not found
        }
        else if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
            clientMessage = `Permission denied: Run the command with elevated permissions (e.g., using 'sudo').`;
            // statusCode = 403; // Forbidden
        }
        else if (error.message.includes('network')) {
            clientMessage = `Network error: Please check your internet connection.`;
            // statusCode = 503; // Service unavailable
        }
        else if (error.message.includes('ERESOLVE')) {
            clientMessage = `Dependency conflict while installing "${libraryName}". Please ensure all required dependencies are compatible.`;
            // statusCode = 409; // Conflict
        }
        else if (error.message.includes('E404')) {
            clientMessage = `Package "${libraryName}" not found in the npm registry. Please check the package name for any typos.`;
            // statusCode = 404; // Not found
        }
        else if (error.message.includes('npm ERR!')) {
            clientMessage = `NPM error during installation.`;
            // statusCode = 500; // Internal server error
        }
        console.error(clientMessage);
        const technicalDetails = error.message.split('\n')[0];
        console.error(`Technical details: ${technicalDetails}`);
        return {
            message: clientMessage,
            technicalDetails: technicalDetails,
            statusCode: 500
        };
    }
}
function getInstalledVersion(libraryName) {
    const command = `npm list ${libraryName} --json`;
    let info = (0, child_process_1.execSync)(command, { stdio: 'pipe' }).toString();
    const data = JSON.parse(info);
    return data.dependencies[libraryName].version;
}
function checkForLib(libraryName, libraryVersion) {
    const dirpath = getStoreDir();
    if (dirpath) {
        const indexFilePath = path.join(dirpath, "index.json");
        const key = `${libraryName}@${libraryVersion}`;
        let data = {};
        if (fs.existsSync(indexFilePath)) {
            const fileContent = fs.readFileSync(indexFilePath, 'utf-8');
            if (fileContent.trim() !== '') {
                data = JSON.parse(fileContent);
            }
            else {
                return false;
            }
        }
        if (data.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }
    else {
        return false;
    }
}
function updateLibraryStatus(libraryName, libraryVersion) {
    const dirpath = getStoreDir();
    let indexFilePath;
    if (dirpath) {
        indexFilePath = path.join(dirpath, 'index.json');
        let data = {};
        if (fs.existsSync(indexFilePath)) {
            const fileContent = fs.readFileSync(indexFilePath, "utf-8");
            //if file was empty
            if (fileContent.trim() !== "") {
                try {
                    data = JSON.parse(fileContent);
                }
                catch (error) {
                    console.error("Error parsing JSON from index.json:", error);
                    return;
                }
            }
        }
        // Update the data with the new library status in json file
        const key = `${libraryName}@${libraryVersion}`;
        data[key] = { status: "success" };
        // Write the updated data back to the file
        fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));
        console.log(`Updated ${key} with status`);
    }
    else {
        console.error("Store directory path not found.");
    }
}
// Main function to extract all component details from TypeScript declaration files
function extractAllComponentDetails(directoryPath, library, type, libraryVersion) {
    try {
        const files = getDeclarationFiles(directoryPath);
        const project = new ts_morph_1.Project();
        const options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            allowJs: true,
            lib: [
                "dom",
                "dom.iterable",
                "esnext"
            ],
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,
            isolatedModules: true,
            noEmit: true,
            sourceMap: true,
            jsx: ts.JsxEmit.ReactJSX
        };
        const program = ts.createProgram(files, options);
        const typeChecker = program.getTypeChecker();
        let sourceFiles = program
            .getSourceFiles()
            .filter((file) => file.fileName.includes(directoryPath));
        sourceFiles = sourceFiles.concat(...getSourceFileofImport(files, project));
        const allComponentNames = getAllComponentNames(sourceFiles);
        const componentDetails = {};
        sourceFiles.forEach(sourceFile => {
            //detailsInfile= extractComponenetDetails(sourceFile,typeChecker,all componentNames,library,directPath)
            const detailsInFile = extractComponentDetails(sourceFile, typeChecker, allComponentNames, library, directoryPath);
            Object.keys(detailsInFile).forEach((key) => {
                if (!(key in componentDetails)) {
                    componentDetails[key] = detailsInFile[key];
                }
            });
        });
        // Create JSON file for the component of perticular library
        let libraryName;
        let getStorePath;
        if (type === "library") {
            libraryName = `${library}@${libraryVersion}`;
            getStorePath = getStoreDir();
        }
        else {
            let projName = libraryVersion;
            libraryName = `${library}`;
            getStorePath = getCustomStoreDir(projName);
        }
        if (getStorePath) {
            const componentStorePath = createComponentDir(getStorePath, type);
            let libraryStorePath;
            if (type === "library") {
                libraryStorePath = path.join(componentStorePath, libraryName, "component");
            }
            else {
                libraryStorePath = path.join(componentStorePath, libraryName);
            }
            // const componentNames: string[] = [];
            const componentNames = new Map();
            // console.log(libraryStorePath)
            if (!fs.existsSync(libraryStorePath)) {
                // console.log("no file are there");
                fs.mkdirSync(libraryStorePath, { recursive: true });
            }
            else {
                fs.rmSync(libraryStorePath, { recursive: true, force: true });
                fs.mkdirSync(libraryStorePath);
            }
            for (const [componentName, { props, importPath, children, _id, name }] of Object.entries(componentDetails)) {
                const componentData = {
                    importPath,
                    props,
                    children,
                    _id,
                    name,
                };
                const componentFilePath = path.join(libraryStorePath, `${componentData._id}.json`);
                fs.writeFileSync(componentFilePath, JSON.stringify(componentData, null, 2), 'utf-8');
                // componentNames.push(componentName);
                const tempPath = libraryStorePath.split('/breezeui')[1];
                const storePath = path.join(tempPath);
                componentNames.set(componentData._id, `${componentName}`);
            }
            const finalComponentFilePath = path.join(libraryStorePath, 'index.json');
            fs.writeFileSync(finalComponentFilePath, JSON.stringify(Object.fromEntries(componentNames), null, 2), 'utf-8');
        }
        return true;
    }
    catch (error) {
        console.error("Error in extractDetails:", error);
        return false;
    }
}
//# sourceMappingURL=parse_library.js.map