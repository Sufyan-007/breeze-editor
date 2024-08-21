import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import {Project, SourceFile} from 'ts-morph'


// Utility function to get all TypeScript declaration files
export function getDeclarationFiles(directory: string): string[] {
    const files: string[] = [];

    function traverseDirectory(currentPath: string) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                traverseDirectory(entryPath);
            } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
                files.push(entryPath);
            }
        }
    }

    traverseDirectory(directory);
    return files;
}

// Function to extract all props of a component
export function extractProps(type: ts.Type, typeChecker: ts.TypeChecker): Record<string, string> {
    const props: Record<string, string> = {};

    const symbol = type.getSymbol();
    if (symbol && symbol.members) {
        symbol.members.forEach((member, key) => {
            const propType = typeChecker.typeToString(typeChecker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!));
            props[key.toString()] = propType;
        });
    }

    const baseTypes = type.getBaseTypes() || [];
    baseTypes.forEach(baseType => {
        const inheritedProps = extractProps(baseType, typeChecker);
        Object.assign(props, inheritedProps);
    });

    return props;
}


// Function to extract all props of a component
export function isReactElement(type: ts.Type, typeChecker: ts.TypeChecker): boolean {
    let isReactEl = false;

    const symbol = type.getSymbol();
    if (symbol && symbol.declarations) {
        for (const dl of symbol.declarations) {
            if (ts.isClassDeclaration(dl) && dl?.heritageClauses) {
                for (const clause of dl.heritageClauses) {
                    for (const typeNode of clause.types) {
                        let name = typeNode.expression.getText()
                        if (name == 'React.Component') {
                            isReactEl = true
                        } else {
                            const baseTypes = type.getBaseTypes() || [];
                            baseTypes.forEach(baseType => {
                                isReactEl = isReactElement(baseType, typeChecker)
                            });

                        }
                    }
                }
            }

        }
    }

    return isReactEl
}



// Function to extract possible children based on naming convention
export function extractPossibleChildren(allComponentNames: string[], parentComponentName: string): string[] {
    const children: string[] = allComponentNames.filter(name =>
        name !== parentComponentName && name.startsWith(parentComponentName)
    );
    return children;
}

const isReactFunctionComponent = (node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction, checker: ts.TypeChecker): boolean => {
    // Get the signature of the function
    // Get the return type of the function
    const signature = checker.getSignatureFromDeclaration(node);
    if (!signature) {
        return false;
    }

    const returnType = checker.getReturnTypeOfSignature(signature);

    if (returnType) {
        // Check if the return type is a React element
        const typeName = checker.typeToString(returnType);
        // Common type names for React components
        if (typeName === 'ReactElement' || typeName === 'JSX.Element' || typeName === 'Element' || typeName === 'Element[]') {
            return true;
        }
        // Optionally, check if the return type includes JSX
        return typeName.includes('ReactElement') || typeName.includes('JSX.Element');
    }
    return false;
};


// Function to extract component details
function extractComponentDetails(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, allComponentNames: string[],library:string,directoryPath:string): { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } {
    const componentDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};
    const functionDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};
    const classDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};

    function visit(node: ts.Node) {
        let componentName: string | undefined;
        let type: ts.Type | undefined;


        if (ts.isTypeAliasDeclaration(node)) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        } else if ((ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) && node.name) {
            componentName = node.name.text;
            type = typeChecker.getTypeAtLocation(node);
            const isJsx = isReactElement(type, typeChecker);
            if (isJsx) {
                const props = extractProps(type, typeChecker);

                const importPath = path.relative(directoryPath, sourceFile.fileName)
                    .replace(/\\/g, '/')
                    .replace(/\.d\.ts$/, '');

                // Adjust import path to match 'craft.js' structure
                const importPathFormatted = importPath.startsWith('esm')
                    ? `@craftjs/core/${importPath.replace('esm/', '')}`
                    : `@craftjs/core/${importPath}`;

                // Collect children components based on naming convention
                const children = extractPossibleChildren(allComponentNames, componentName);

                componentDetails[componentName] = { props, importPath: importPathFormatted, children };
            }
        }
        else if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {


            let isFunctionalComponent = isReactFunctionComponent(node, typeChecker)
            if (isFunctionalComponent) {
                const parameters = node.parameters;
                let functionName = node.name ? node.name.getText() : 'default';
                let myuuid = uuidv4();
                myuuid = myuuid.replace("-","_");
                functionName = myuuid;
                let parentNode = node.parent as ts.Node
                if(node.parent){
                    // remaining part 
                    // extract name of the function
                }
                let formattedParams: Record<string, string> = {};

                parameters.map(param => {
                    const name = param.name.getText();
                    const type = param.type ? param.type.getText() : 'any';
                    formattedParams[name] = type;
                });
                componentDetails[functionName] = { props: formattedParams, importPath: "importPathFormatted", children: [""] };

            }
        }


        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return componentDetails;
}

//to get all sourceFile according to ts-morph libraray
function getTSMorphSourceFiles(files: string[],project:Project):SourceFile[]{
    let sourceFiles: SourceFile[] = [];
    for(const file of files){
      sourceFiles.push(project.addSourceFileAtPath(file));
    }
    return sourceFiles;
  }

//to get all nested sourceFiles of importDeclaration
function getRecursivelySourceFilesofImport(sf:SourceFile,ref:any[],processedSourceFiles:string[],files:string[]){
    const importsDec = sf.getImportDeclarations();
    if(!importsDec.length){
        return;
    }
    for(const imp of importsDec){
        const moduleSpecifierSourceFile = imp.getModuleSpecifierSourceFile();
        const moduleSpecifierName = imp.getModuleSpecifierValue();
        if(moduleSpecifierSourceFile && !processedSourceFiles.includes(moduleSpecifierName)){
            ref.push(moduleSpecifierSourceFile.compilerNode);
            files.push(moduleSpecifierSourceFile.getFilePath())
            processedSourceFiles.push(moduleSpecifierName);
            getRecursivelySourceFilesofImport(moduleSpecifierSourceFile,ref,processedSourceFiles,files);
        }
    }
    return ;
}
function getSourceFileofImport(files: string[],project:Project){
    //    const missedComponentName = [];
    //    const exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol() || sourceFile.getDefaultExportSymbol();
    //    const dec = getDeclaration(exportVarSymbol);
          const sourceFiles = getTSMorphSourceFiles(files,project);
          let ref:any[] = [];
          const processedSourceFiles:string[] = [];
          for(const sf of sourceFiles){
            getRecursivelySourceFilesofImport(sf,ref,processedSourceFiles,files);
            // componentNames.push(...getAllComponentNames(ref));
            // }
          
    }
    return ref;
}


// Function to get all component names
export function getAllComponentNames(sourceFiles: ts.SourceFile[]): string[] {
    const componentNames: string[] = [];

    sourceFiles.forEach(sourceFile => {
        function visit(node: ts.Node) {
            if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text.endsWith('Props')) {
                const componentName = node.name.text.replace('Props', '');
                componentNames.push(componentName);
            } else if (ts.isClassDeclaration(node) && node.name) {
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
function getStoreDir(): string | null {
    let currentDir = __dirname

        while (!fs.existsSync(path.join(currentDir, 'third_party_configs'))) {
            const parentDir = path.join(currentDir, '..');
            if (currentDir === parentDir) {
                // Reached the root of the filesystem
                return null;
            }
            currentDir = parentDir;
        }
        
        return path.join(currentDir, 'third_party_configs');
    
}

function createComponentDir(baseDir: string): string{
    const componentDir = path.join(baseDir, 'libs');
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir);
    //   console.log(`Component directory created at: ${componentDir}`);
    } else {
      console.log(`Component directory already exists at: ${componentDir}`);
    }
    return componentDir;
  }


// Main function to extract all component details from TypeScript declaration files
export function extractAllComponentDetails(directoryPath: string, library: string) {
    const files = getDeclarationFiles(directoryPath);
    const project  = new Project();

    const program = ts.createProgram(files, {});
    const typeChecker = program.getTypeChecker();
    let sourceFiles = program.getSourceFiles().filter(file => file.fileName.includes(directoryPath));
    sourceFiles = sourceFiles.concat(...getSourceFileofImport(files,project));
    const allComponentNames = getAllComponentNames(sourceFiles);

    const componentDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};

    sourceFiles.forEach(sourceFile => {

            const detailsInFile = extractComponentDetails(sourceFile, typeChecker, allComponentNames, library, directoryPath);
            Object.assign(componentDetails, detailsInFile);
        
    });
    
    // Create JSON file for the component of perticular library
    const libraryName = library; 
    const getStorePath = getStoreDir();
    if(getStorePath){
        const componentStorePath=createComponentDir(getStorePath)
        const libraryStorePath = path.join(componentStorePath,libraryName,"component");
        
        // const componentNames: string[] = [];
        const componentNames: Map<string, string> = new Map();

        console.log(libraryStorePath)
        if (!fs.existsSync(libraryStorePath)) {
            // console.log("no file are there");
            fs.mkdirSync(libraryStorePath, { recursive: true });
        } 
        else{
            fs.rmSync(libraryStorePath,{ recursive: true, force: true });
            fs.mkdirSync(libraryStorePath);
        }
        
        for (const [componentName, { props, importPath, children }] of Object.entries(componentDetails)) {
            const componentData = {
                importPath,
                props,
                children
            };
            
            const componentFilePath = path.join(libraryStorePath, `${componentName}.json`);
            fs.writeFileSync(componentFilePath, JSON.stringify(componentData, null, 2), 'utf-8');
            // componentNames.push(componentName);
            componentNames.set(componentName, `${libraryStorePath}/${componentName}.json`);
        }
        
        const finalComponentFilePath = path.join(libraryStorePath, '__component.json');
        fs.writeFileSync(finalComponentFilePath, JSON.stringify(Object.fromEntries(componentNames), null, 2), 'utf-8');
    }



}

