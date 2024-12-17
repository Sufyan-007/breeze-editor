import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Project, SourceFile } from "ts-morph";
import { execSync } from "child_process";
import { CUSTOMIZED_PROJ_CONFIG, CONFIG_PATH } from "./consts"
const fileTypes: string[] = [".d.ts", ".js", ".ts"];
import {FunctionParamsRecord,VariableDetails,FunctionDescription,TagAndItsComment,FunctionText} from "./types";
import { GoogleGenerativeAI,SchemaType } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.dotenv_config_path });
  // Access your API key as an environment variable
  const key:any = process.env.API_KEY
  const genAI = new GoogleGenerativeAI(key);
const axios = require('axios');
// Utility function to get all TypeScript declaration files
export function getDeclarationFiles(directory: string): string[] {
  const files: string[] = [];

  function traverseDirectory(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverseDirectory(entryPath);
      } else if (entry.isFile() && fileTypes.some((type) => { const l = entry.name.split("."); return "."+l.pop() === type }   )
      ) {
        files.push(entryPath);
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

// Function to extract all props of a component
export function extractProps(
  type: ts.Type,
  typeChecker: ts.TypeChecker
): Record<string, string> {
  const props: Record<string, string> = {};

  const symbol = type.getSymbol();
  if (symbol && symbol.members) {
    symbol.members.forEach((member, key) => {
      const propType = typeChecker.typeToString(
        typeChecker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!)
      );
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
function isReactElement(type: ts.Type, typeChecker: ts.TypeChecker): boolean {
  let isReactEl = false;

  const symbol = type.getSymbol();
  if (symbol && symbol.declarations) {
    for (const dl of symbol.declarations) {
      if (
        (ts.isClassDeclaration(dl) || ts.isInterfaceDeclaration(dl)) &&
        dl?.heritageClauses
      ) {
        for (const clause of dl.heritageClauses) {
          for (const typeNode of clause.types) {
            let name = typeNode.expression.getText();
            if (
              name.includes("Component") ||
              name.includes("React.") ||
              name == "React.Component" ||
              name == "Component"
            ) {
              isReactEl = true;
            } else {
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
export function extractPossibleChildren(
  allComponentNames: string[],
  parentComponentName: string
): string[] {
  const children: string[] = allComponentNames.filter(
    (name) =>
      name !== parentComponentName && name.startsWith(parentComponentName)
  );
  return children;
}

const isReactFunctionComponent = (
  node: ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction,
  checker: ts.TypeChecker
): boolean => {
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
    if (
      typeName === "ReactElement" ||
      typeName === "JSX.Element" ||
      typeName === "Element" ||
      typeName === "Element[]"
    ) {
      return true;
    }
    if (typeName === "any") {
      function visit(child: ts.Node) {
        if (
          ts.isJsxElement(child) ||
          ts.isJsxSelfClosingElement(child) ||
          ts.isJsxFragment(child)
        ) {
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
    return (
      typeName.includes("Component") ||
      typeName.includes("ReactElement") ||
      typeName.includes("JSX.Element")
    );
  }
  return false;
};

function findFunctionNames(node: ts.Node) {
    if (ts.isCallExpression(node)) {
        const functionName = getFunctionNameCall(node.expression);
        // if (functionName) {
        //    console.log("Function Name:", functionName);
        // }
    }
    ts.forEachChild(node, findFunctionNames);
}

function getFunctionNameCall(node: ts.Expression): string {
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

function getFunctionName(node: ts.Node): string {
  let name = null;
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node)
  ) {
    if (node.name) {
      name = node.name.getText();
    }
  } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    if (
      node.initializer &&
      (ts.isFunctionExpression(node.initializer) ||
        ts.isArrowFunction(node.initializer))
    ) {
      name = node.name.getText();
    }
  } else if (ts.isClassDeclaration(node) && node.name) {
    name = node.name.getText();
  } else if (ts.isInterfaceDeclaration(node) && node.name) {
    name = node.name.getText();
  }
  if (ts.isFunctionDeclaration(node) && node.name) {
    name = node.name.getText();
  }
  if (
    node.parent &&
    ts.isVariableDeclaration(node.parent) &&
    ts.isIdentifier(node.parent.name)
  ) {
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
    let myuuid = uuidv4();
    myuuid = myuuid.replace("-", "_");
    return "";
  } else {
    return name;
  }
}


type ComponentProp = {
  prop_name: string;
  type: string;
  default_value: string;
  id: string;
};

type ComponentDetails = {
  _id: string;
  name: string;
  props: Record<string, ComponentProp>; // UUIDs as keys with ComponentProp as values
  importPath: string;
  children: string[];
};
type FunctionDetails = {
  _id:string,
  name:string,
  params:FunctionParamsRecord,
  importPath:string,
  returnType:string|undefined,
  description:FunctionDescription ,
  isHooks:Boolean
}
type AllDetails = {
  'components': { [componentName: string]: ComponentDetails },
  'functions': { [_id: string]: FunctionDetails },
  'variables':{[variableName:string]:VariableDetails}
}
// Function to extract component details

function extractComponentDetails(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, allComponentNames: string[], library: string, directoryPath: string,functionText:FunctionText[]): AllDetails{
    
  // const allDetails:{[componentName]:ComponentDetails,[functionName]:FunctionDetails} = {};
  const componentDetails: { [componentName: string]: ComponentDetails } = {};
  const functionDetails : {[_id:string]:FunctionDetails} = {};
  const variableDetails: {[variableName:string]:VariableDetails} = {};
  type FormattedProps = Record<string, ComponentProp>;
  // const componentDetails: { [componentName: string]: {_id:string, name:string , props: Record<string, string>, importPath: string, children: string[]} } = {};
    // const functionDetails: { [functionName: string]: {_id:string,name:string, params: recordList, importPath: string } } = {};
  const classDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};
  // const functionText:FunctionText[] = [];

  function visit(node: ts.Node) {
    let componentName: string | undefined;
    let type: ts.Type | undefined;

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

        
            if (isJsx || node.name.text.endsWith('Props')) {
                const props = extractProps(type, typeChecker);
                const formattedProps: FormattedProps = {};

                for (const [propName, propType] of Object.entries(props)) {
                  let uuid = uuidv4();
                  uuid = uuid.replace(/-/g, "_");
                  formattedProps[uuid] = {
                    prop_name: propName,
                    type: propType,
                    default_value: "",  // Default value can be adjusted as needed
                    id: uuid            // Replace with appropriate id logic if needed
                  };
                }

                // Adjust import path to match 'craft.js' structure

                // Collect children components based on naming convention
                const children = extractPossibleChildren(allComponentNames, componentName);
                let myuuid = uuidv4();
                myuuid = myuuid.replace(/-/g, "_");
                const _id=myuuid;

                componentDetails[componentName] = {
                  _id,
                  name: componentName,
                  props: formattedProps,  // formattedProps is the correct structure here
                  importPath: importPathFormatted,
                  children
                };  
                
                
           }
        }
        else if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {


            let isFunctionalComponent = isReactFunctionComponent(node, typeChecker)
            if (isFunctionalComponent) {
                const parameters = node.parameters;
                let functionName = null;
                if (node.name) {
                    functionName = node.name.getText();
                }
                if(!functionName || functionName == '__function'){
                    let parentNode = node.parent;
                    functionName = getFunctionName(parentNode)
                }

                if(functionName){

                    
                    // let parentNode = node.parent as ts.Node
                    // if (node.parent) {
                        //     // remaining part 
                        //     // extract name of the function
                        
                        // }
                        // let formattedParams: Record<string, string> = {};
                        const formattedProps: FormattedProps = {};

                        
                        parameters.map(param => {
                          if('elements' in param?.name ){
                            for(const element of param.name.elements){
                              const name = element.getText();
                              const type = 'any';

                              let uuid = uuidv4();
                              uuid = uuid.replace(/-/g, "_");

                              formattedProps[uuid] = {
                                prop_name: name,
                                type: type,
                                default_value: "",  // Default value can be adjusted as needed
                                id: uuid            // Replace with appropriate id logic if needed
                              };
                              }
                          }
                          else{
                            const name = param.name.getText();
                            const type = param.type ? param.type.getText() : 'any';
                            
                            let uuid = uuidv4();
                            uuid = uuid.replace(/-/g, "_");
                            
                            formattedProps[uuid] = {
                                prop_name: name,
                                type: type,
                                default_value: "",  // Default value can be adjusted as needed
                                id: uuid            // Replace with appropriate id logic if needed
                              };
                            }
                        });

                        let myuuid = uuidv4();
                        myuuid = myuuid.replace(/-/g, "_");
                        const _id=myuuid;
                        componentDetails[functionName] = {
                          _id,
                          name: functionName,
                          props: formattedProps,  // formattedProps is the correct structure here
                          importPath: importPathFormatted,
                          children: [""]
                        };
                        
                }
                
            }
            else{
              if(node.name){
                let myuuid = uuidv4();
                myuuid = myuuid.replace(/-/g, "_");
                const _id=myuuid;
                const functionName = node.name.getText()
                functionDetails[_id] = {
                  _id,
                  name:functionName,
                  params:getFunctionParameter(node),
                  importPath:importPathFormatted,
                  returnType: node.type?.getText(),
                  description: getDescription(node),
                  isHooks: node.name.getText().startsWith('use') && node.name.getText()!= 'use' ? true:false 
                }
                //store all functionText which have to generate its description using ai
                if(functionDetails[_id].description.willUseAIDesc){
                  functionText.push({
                    _id,
                    'functionText':functionDetails[_id].description.functionText})
                }
              }
            }
        }
  else if (ts.isVariableStatement(node)) {
    
    let declarationType:string;
    if (node.declarationList.flags & ts.NodeFlags.Const) {
      declarationType = 'const';
    } else if (node.declarationList.flags & ts.NodeFlags.Let) {
      declarationType = 'let';
    } else {
      declarationType = 'var';
    }

    node.declarationList.declarations.forEach(declaration => {
      if (ts.isVariableDeclaration(declaration)) {
        let myuuid = uuidv4();
        myuuid = myuuid.replace(/-/g, "_");
        const _id=myuuid;
        const name = declaration.name.getText();
        if(declaration.initializer && ts.isArrowFunction(declaration.initializer)){
          functionDetails[_id] = {
            _id,
            name,
            params:getFunctionParameter(declaration.initializer),
            importPath:importPathFormatted,
            returnType: declaration.initializer.type?.getText(),
            description: getDescription(declaration.initializer),
            isHooks: name.startsWith('use') ? true:false 
          }
          if(functionDetails[_id].description.willUseAIDesc){
            functionText.push({
              _id,
              'functionText':functionDetails[_id].description.functionText})
          }
        }
        else{
          let valueType:string | null=null;
          let value:string | null =null;
          if(declaration.initializer){
            value = declaration.initializer.getText();
            const initializerType = typeChecker.getTypeAtLocation(declaration.initializer);
            valueType = typeChecker.typeToString(initializerType);
          }
          const filePath = importPath;
          let dataType: string | undefined;
          if (declaration.name) {
            const symbol = typeChecker.getSymbolAtLocation(declaration.name);
            if (symbol) {
              const type = typeChecker.getTypeOfSymbolAtLocation(
                symbol,
                declaration.name
              );
              dataType = typeChecker.typeToString(type);
            }
          }
          variableDetails[name] = {
            varName:name,
            declarationType,
            value:{value,type:valueType},
            _id,
            filePath,
            dataType
          }
        }
      }
    });
}


    ts.forEachChild(node, visit);
    // for (const child of node.getChildren()) {
    //   visit(child);  // Ensure each child is visited asynchronously
    // }
  }
  visit(sourceFile);
  return {
    'components':componentDetails,
    'functions':functionDetails,
    'variables':variableDetails
  };

}

//to get all sourceFile according to ts-morph libraray
function getTSMorphSourceFiles(
  files: string[],
  project: Project
): SourceFile[] {
  let sourceFiles: SourceFile[] = [];
  for (const file of files) {
    sourceFiles.push(project.addSourceFileAtPath(file));
  }
  return sourceFiles;
}

function getDescription(node:ts.Node):FunctionDescription{
  const functionDescription: FunctionDescription = {
    functionText: '', // Default value for functionText
    uses: undefined,  // Default value for uses
    tagsAndItsComment: [],// Default value for tags (empty array)
    willUseAIDesc:false // If the variable indicates that AI will be used in the future to generate descriptions
  }
  const functionText:string = node.getText();
  functionDescription.functionText = functionText;
  let isParamOrReturnTagExist = false;
  if('jsDoc' in node && node.jsDoc){
    (node.jsDoc as ts.JSDoc[]).forEach(jsDoc=>{
      if (jsDoc.comment) {
        functionDescription.uses = ts.getTextOfJSDocComment(jsDoc.comment);
      }

      // Format tags like @param and @returns
      if (jsDoc.tags) {
        jsDoc.tags.forEach(tag => {
          const tagName = tag.tagName.getText();
          if(tagName === 'param' || tagName ==='return'){
            isParamOrReturnTagExist = true;
          const comment = ts.getTextOfJSDocComment(tag.comment)
          const tagAndItsComment:TagAndItsComment = {
            tagName,
            comment
          }
          functionDescription.tagsAndItsComment.push(tagAndItsComment)
        }
        });
        if(!isParamOrReturnTagExist)
          functionDescription.willUseAIDesc = true;

      }
      else{
        functionDescription.willUseAIDesc = true;
      }
    })
  }
  else{
    // const data={functionText};
    functionDescription.willUseAIDesc = true

    // const resdata:any = await getHooksDescription(data);
    // // const resdata:any = ''
    // const description = JSON.parse(resdata.description);
    // functionDescription.uses = description.uses;
    // functionDescription.functionText = description.functionText;
    // functionDescription.tagsAndItsComment = description.tagsAndItsComment;
  }
  if(!isParamOrReturnTagExist)
    functionDescription.willUseAIDesc = true;
  return functionDescription;
}
function getFunctionParameter(node:ts.Node):FunctionParamsRecord{
  const params:FunctionParamsRecord = {};
  if(ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)){
    const parameters = node.parameters
    parameters.forEach((param)=>{
      if(param.name.kind == ts.SyntaxKind.ObjectBindingPattern){
        param.name.elements.forEach((ele)=>{
          let uuid = uuidv4();
          uuid = uuid.replace(/-/g, "_");
          params[uuid] = {
            'name':ele.name.getText(),
            'type':undefined,
            'default_value':getParamsDefaultValue(ele),
            'isOptional':false,
            'id':uuid
          }
        })
      }
      else{
        getParams(param,params)
      }
    })
  }
  return params
}

function getParams(param:ts.ParameterDeclaration,params:FunctionParamsRecord){
  let uuid = uuidv4();
  uuid = uuid.replace(/-/g, "_");
  params[uuid] = {
    'name':param.name.getText(),
    'type': param.type?.getText(),
    'default_value':getParamsDefaultValue(param),
    'isOptional' : !!param.questionToken,
    'id':uuid
  }
}

function getParamsDefaultValue(param:ts.ParameterDeclaration|ts.BindingElement):any{
  // return param.initializer ? param.initializer.getText():null
  if(!param.initializer)
    return null
  switch (param.initializer.kind) {
    case ts.SyntaxKind.TrueKeyword:
        return true;
    case ts.SyntaxKind.FalseKeyword:
        return false;
    case ts.SyntaxKind.NumericLiteral:
        return Number((param.initializer as ts.NumericLiteral).text);
    case ts.SyntaxKind.StringLiteral:
        return (param.initializer as ts.StringLiteral).text;
    default:
        return param.initializer.getText();
}
}

//to get all nested sourceFiles of importDeclaration
function getRecursivelySourceFilesofImport(
  sf: SourceFile,
  ref: any[],
  processedSourceFiles: string[],
  files: string[]
) {
  const importsDec = sf.getImportDeclarations();
  if (!importsDec.length) {
    return;
  }
  for (const imp of importsDec) {
    const moduleSpecifierSourceFile = imp.getModuleSpecifierSourceFile();
    const moduleSpecifierName = imp.getModuleSpecifierValue();
    if (
      moduleSpecifierSourceFile &&
      !processedSourceFiles.includes(moduleSpecifierName)
    ) {
      ref.push(moduleSpecifierSourceFile.compilerNode);
      files.push(moduleSpecifierSourceFile.getFilePath());
      processedSourceFiles.push(moduleSpecifierName);
      getRecursivelySourceFilesofImport(
        moduleSpecifierSourceFile,
        ref,
        processedSourceFiles,
        files
      );
    }
  }
  return;
}

function getSourceFileofImport(files: string[], project: Project) {
  //    const missedComponentName = [];
  //    const exportVarSymbol = sourceFile.getDefaultExportSymbol().getAliasedSymbol() || sourceFile.getDefaultExportSymbol();
  //    const dec = getDeclaration(exportVarSymbol);
  const sourceFiles = getTSMorphSourceFiles(files, project);
  let ref: any[] = [];
  const processedSourceFiles: string[] = [];
  for (const sf of sourceFiles) {
    getRecursivelySourceFilesofImport(sf, ref, processedSourceFiles, files);
    // componentNames.push(...getAllComponentNames(ref));
    // }
  }
  return ref;
}

// Function to get all component names
export function getAllComponentNames(sourceFiles: ts.SourceFile[]): string[] {
  const componentNames: string[] = [];

  // sourceFiles = sourceFiles.filter((sf)=>sf.fileName === '/home/subham/breezeui/third_party_package_parser/node_modules/react-bootstrap/cjs/AccordionButton.d.ts')
  sourceFiles.forEach((sourceFile) => {
    function visit(node: ts.Node) {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text.endsWith("Props")
      ) {
        const componentName = node.name.text.replace("Props", "");
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

function getCustomStoreDir(projName:string|null): string | null {
    let currentDir = __dirname

    while (!fs.existsSync(path.join(currentDir, 'breezeui'))) {
        const parentDir = path.join(currentDir, '..');
        if (currentDir === parentDir) {
            // Reached the root of the filesystem
            return null;
        }
        currentDir = parentDir;
    }

    return path.join(currentDir,`${CONFIG_PATH}/${projName}/${CUSTOMIZED_PROJ_CONFIG}`);
}

function createComponentDir(baseDir: string,type:string): string {
    let componentDir;
    if(type==="library"){
        componentDir = path.join(baseDir);
    }
    else{
        componentDir = path.join(baseDir);
    }
    return componentDir;
}


//install library
export function install_library(libraryName:string , libraryVersion:string) :{ message: string, technicalDetails: string, statusCode: number }{
    try{
        if (!libraryName) {
            console.error('Please provide a package name.');
            return {message:'Please provide a package name.',technicalDetails:"",statusCode:500};
        }

        if (libraryVersion) {
            libraryName = `${libraryName}@${libraryVersion}`// execSync(command, (error, stdout, stderr) => {
        }

        const command = `npm audit fix && npm install ${libraryName} --save`;        

        const stdout = execSync(command, { stdio: 'pipe' }).toString();

        console.log(`\n---PACKAGE ${libraryName} INSTALLATION SUCCESSFUL---`);
        return {
            message:`---PACKAGE ${libraryName} INSTALLATION SUCCESSFUL---`,
            technicalDetails:"",
            statusCode:200
        };
    } catch (error: any) {

    // Handle specific errors during package installation

    let clientMessage = `Failed to install the package "${libraryName}". Please try again later or contact support.`;
        
    if (error.message.includes('ENOENT')) {
        clientMessage = `Command not found: npm might not be installed or is not in the PATH.`;
        // statusCode = 404; // Not found
    }  else if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
        clientMessage = `Permission denied: Run the command with elevated permissions (e.g., using 'sudo').`;
        // statusCode = 403; // Forbidden
    } else if (error.message.includes('network')) {
        clientMessage = `Network error: Please check your internet connection.`;
        // statusCode = 503; // Service unavailable
    } else if (error.message.includes('ERESOLVE')) {
        clientMessage = `Dependency conflict while installing "${libraryName}". Please ensure all required dependencies are compatible.`;
        // statusCode = 409; // Conflict
    }else if (error.message.includes('E404')) {
        clientMessage = `Package "${libraryName}" not found in the npm registry. Please check the package name for any typos.`;
        // statusCode = 404; // Not found
    }else if (error.message.includes('npm ERR!')) {
        clientMessage = `NPM error during installation.`;
        // statusCode = 500; // Internal server error
    }
    console.error(clientMessage);
    
    const technicalDetails = error.message.split('\n')[0]; 
    console.error(`Technical details: ${technicalDetails}`);
    return {
        message:clientMessage,
        technicalDetails:technicalDetails,
        statusCode:500
    };

    }
}

export function getInstalledVersion(libraryName: string) {
  const command = `npm list ${libraryName} --json`;

    let info = execSync(command, { stdio: 'pipe' }).toString();
    const data = JSON.parse(info);
    return data.dependencies[libraryName].version;
}

export function checkForLib(libraryName:string,libraryVersion:string):boolean{
    const dirpath = getStoreDir();
    if(dirpath){
        const indexFilePath = path.join(dirpath,"index.json");
        const key=`${libraryName}@${libraryVersion}`;
        let data: Record<string, { status: string }> = {};
        if (fs.existsSync(indexFilePath)) {
            const fileContent = fs.readFileSync(indexFilePath, 'utf-8');
            if (fileContent.trim() !== '') {
                data = JSON.parse(fileContent) as Record<string, { status: string }>;
            }
            else{
                return false;
            }
        }

    if (data.hasOwnProperty(key)) {
      return true;
    }

    return false;
  } else {
    return false;
  }
}

export function updateLibraryStatus(
  libraryName: string,
  libraryVersion: string
): void {
  const dirpath = getStoreDir();
  let indexFilePath: string | undefined;

    if (dirpath) {
        indexFilePath = path.join(dirpath, 'index.json');
        let data: Record<string, { status: string }> = {};

    if (fs.existsSync(indexFilePath)) {
      const fileContent = fs.readFileSync(indexFilePath, "utf-8");

      //if file was empty
      if (fileContent.trim() !== "") {
        try {
          data = JSON.parse(fileContent) as Record<string, { status: string }>;
        } catch (error) {
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
  } else {
    console.error("Store directory path not found.");
  }
}

// Main function to extract all component details from TypeScript declaration files
export function extractAllComponentDetails(directoryPath: string, library: string, type:string, libraryVersion:string ):boolean {
    try{
        const files = getDeclarationFiles(directoryPath);
        const project = new Project();
        const options: ts.CompilerOptions = {
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

        const componentDetails: { [componentName: string]: ComponentDetails } = {};
        const functionDetails: { [_id: string]: FunctionDetails } = {};
        const variableDetails:{[variableName: string]:VariableDetails} = {};
        //store those functionText whose description will be generated by ai
        const functionText:FunctionText[]=[];
        // sourceFiles = sourceFiles.filter((sf)=>sf.fileName === "/home/subham/breezeui/third_party_package_parser/node_modules/react-bootstrap/esm/Dropdown.d.ts")

        processSourceFiles(sourceFiles,typeChecker,allComponentNames,library,directoryPath,componentDetails,functionDetails,variableDetails,functionText)
        
        // for now i commented below code for future uses
        // below code uses gemini ai model to generate description of hooks and function.

        // let hooksDescription:any;
        // if(functionText.length!=0){
        //   //get the description of hooks using AI
        //   let data:any = await getHooksDescription(functionText);
        //   try {
        //     hooksDescription = JSON.parse(data);
        //     for(let desc of hooksDescription){
        //       functionDetails[desc._id].description = {...desc,isUseAIDesc:true};
        //     }
        //   }
        //   catch(error){
        //     console.error("Error parsing JSON:");
        //     throw(error);
        //     // res.status(500).json({ error: "Could not parse JSON response from Gemini" }); 
        //     // data = '['+data+']';
        //     // hooksDescription = JSON.parse(data);
        //   }
        //   //update the functionDetails's description with the description generated by AI
        // }
       
        
        // Create JSON file for the component of perticular library
        
        let libraryName; 
        let getStorePath;
        if(type === "library"){
            libraryName = `${library}@${libraryVersion}`;
            getStorePath = getStoreDir();
        }
        else{
            let projName = libraryVersion
            libraryName = `${library}`;
            getStorePath = getCustomStoreDir(projName);
        }

        if(getStorePath){
            const componentStorePath=createComponentDir(getStorePath,type);
            let libraryStorePath;
            let hooksStorePath;
            let variablesStorePath;
            let functionsStorePath;
            if(type==="library"){
                libraryStorePath = path.join(componentStorePath,libraryName,"component");
                hooksStorePath = path.join(componentStorePath,libraryName,"hooks");
                variablesStorePath = path.join(componentStorePath,libraryName,"variables");
                functionsStorePath = path.join(componentStorePath,libraryName,'functions');
            }
            else{
                libraryStorePath = path.join(componentStorePath,libraryName,"component");
                hooksStorePath = path.join(componentStorePath,libraryName,"hooks");
                variablesStorePath = path.join(componentStorePath,libraryName,"variables");
                functionsStorePath = path.join(componentStorePath,libraryName,'functions');
            }

            // const componentNames: string[] = [];
            const componentNames: Map<string, string> = new Map();

            const hooksNames: Map<string, string> = new Map();

            const functionNames: Map<string, string> = new Map();

            const variableNames: Map<string,string> = new Map();
            
            // console.log(libraryStorePath)
            if (!fs.existsSync(libraryStorePath)) {
                // console.log("no file are there");
                fs.mkdirSync(libraryStorePath, { recursive: true });
            } 
            else{
                fs.rmSync(libraryStorePath,{ recursive: true, force: true });
            }
            if (!fs.existsSync(hooksStorePath)) {
              // console.log("no file are there");
              fs.mkdirSync(hooksStorePath, { recursive: true });
            } 
            else{
              fs.rmSync(hooksStorePath,{ recursive: true, force: true });
            }
            if (!fs.existsSync(variablesStorePath)) {
              // console.log("no file are there");
              fs.mkdirSync(variablesStorePath, { recursive: true });
            } 
            else{
              fs.rmSync(variablesStorePath,{ recursive: true, force: true });
            }
            if (!fs.existsSync(functionsStorePath)) {
              // console.log("no file are there");
              fs.mkdirSync(functionsStorePath, { recursive: true });
            } 
            else{
              fs.rmSync(functionsStorePath,{ recursive: true, force: true });
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
                const tempPath = libraryStorePath.split('/breezeui')[1]
                
                const storePath = path.join(tempPath);
                componentNames.set(componentData._id, `${componentName}`);
                
            }
            for (const [id, { params, _id, name,importPath,returnType,description,isHooks }] of Object.entries(functionDetails)) {
              const functionData = {
                  importPath,
                  params,
                  _id,
                  name,
                  returnType,
                  description
              };
              let functionsFilePath:any;
              if(isHooks){
                functionsFilePath = path.join(hooksStorePath, `${functionData._id}.json`);
                hooksNames.set(functionData._id, `${functionData.name}`);
              }
              else{
                functionsFilePath = path.join(functionsStorePath, `${functionData._id}.json`);
                functionNames.set(functionData._id, `${functionData.name}`);
              }
              fs.writeFileSync(functionsFilePath, JSON.stringify(functionData, null, 2), 'utf-8');
              // componentNames.push(componentName);
              // const tempPath = hooksStorePath.split('/breezeui')[1]
              
              // const storePath = path.join(tempPath);
              // functionNames.set(functionData._id, `${functionData.name}`);
              
          }
          for (const [variableName, { value,_id, varName,declarationType,filePath,dataType }] of Object.entries(variableDetails)) {
            const variablesData = {
                declarationType,
                _id,
                varName,
                value,
                filePath,
                dataType
            };
            
            const variablesFilePath = path.join(variablesStorePath, `${variablesData._id}.json`);
            fs.writeFileSync(variablesFilePath, JSON.stringify(variablesData, null, 2), 'utf-8');
            // componentNames.push(componentName);
            const tempPath = variablesStorePath.split('/breezeui')[1]
            
            const storePath = path.join(tempPath);
            variableNames.set(variablesData._id, `${variableName}`);
            
        }
            
            const finalComponentFilePath = path.join(libraryStorePath, 'index.json');
            const finalFunctionFilePath = path.join(functionsStorePath,'index.json');
            const finalVariableFilePath = path.join(variablesStorePath,'index.json');
            const finalHooksFilePath = path.join(hooksStorePath,'index.json');
            
            fs.writeFileSync(finalComponentFilePath, JSON.stringify(Object.fromEntries(componentNames), null, 2), 'utf-8');
            fs.writeFileSync(finalFunctionFilePath, JSON.stringify(Object.fromEntries(functionNames), null, 2), 'utf-8');
            fs.writeFileSync(finalHooksFilePath, JSON.stringify(Object.fromEntries(hooksNames), null, 2), 'utf-8');
            fs.writeFileSync(finalVariableFilePath, JSON.stringify(Object.fromEntries(variableNames), null, 2), 'utf-8');

        }
        return true;
    }catch(error){
        console.error("Error in extractDetails:", error);
        return false;
    }   
}

async function getHooksDescription(functionTexts: FunctionText[]) {
  let limitFunctionTexts = functionTexts.slice(0,10);
  // try {
  //   const response = await axios.post('http:0.0.0.0:4000/generate-hooks-description', limitFunctionTexts, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   if (!response.data) {
  //     throw new Error('Received empty response from server');
  //   }

  //   return response.data;
  // } catch (error) {
  //     // Handle general errors (not related to Axios)
  //     console.error('Error occurred:', error);
  //     throw new Error('An unexpected error occurred while fetching the hooks description');
  // }
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" }});
  // const functionTexts = req.body.slice(0, 30);

  const prompts = limitFunctionTexts.map((element: any) => ({
    _id: element._id,
    functionText: element.functionText,
  }));

  const prompt = `Generate JSDoc comments for the following functions. Return the results as a JSON array where each object has: _id, functionText, uses, and tagsAndItsComment (an array of objects with tagName and comment).  The input functions are: ${JSON.stringify(prompts)}

Example Output (JSON):
[
  {
    "_id": "someId1",
    "functionText": "function myFunc(a: number): string",
    "uses": "This function does X",
    "tagsAndItsComment": [
      {"tagName": "param", "comment": "Parameter a"},
      {"tagName": "return", "comment": "The result string"}
    ]
  },
  {
    "_id": "someId2",
    "functionText": "anotherFunction()",
    "uses": "Another function does Y",
    "tagsAndItsComment": []
  }
]`;

const result = await model.generateContent(prompt);// we can also use .then so that other things don't get paused
const generatedDescription:string|undefined= result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
return generatedDescription;
// console.log(result);
}

function processSourceFiles(sourceFiles:ts.SourceFile[],typeChecker:ts.TypeChecker,allComponentNames:string[],library:string,directoryPath:string,componentDetails: { [componentName: string]: ComponentDetails },functionDetails: { [functionName: string]: FunctionDetails },variableDetails:{[variableName: string]:VariableDetails},functionText:FunctionText[]){
  for(const sourceFile of sourceFiles){
    const {components,functions,variables} = extractComponentDetails(sourceFile, typeChecker, allComponentNames, library, directoryPath,functionText);
            const detailsInFile = components
            // const detailsInFile = extractComponentDetails(sourceFile, typeChecker, allComponentNames, library, directoryPath);
        Object.keys(detailsInFile).forEach((key) => {
            if (!(key in componentDetails)) {
                (componentDetails as any)[key] = (detailsInFile as any)[key];
            }
        });
        Object.keys(functions).forEach((key) => {
            if (!(key in functionDetails)) {
              (functionDetails as any)[key] = (functions as any)[key];
            }
        });
        Object.keys(variables).forEach((key) => {
            if (!(key in variableDetails)) {
              (variableDetails as any)[key] = (variables as any)[key];
            }
        });
  }
}