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
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
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
            else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
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
    baseTypes.forEach(baseType => {
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
            if (ts.isClassDeclaration(dl) && (dl === null || dl === void 0 ? void 0 : dl.heritageClauses)) {
                for (const clause of dl.heritageClauses) {
                    for (const typeNode of clause.types) {
                        let name = typeNode.expression.getText();
                        if (name == 'React.Component') {
                            isReactEl = true;
                        }
                        else {
                            const baseTypes = type.getBaseTypes() || [];
                            baseTypes.forEach(baseType => {
                                isReactEl = isReactElement(baseType, typeChecker);
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
    const children = allComponentNames.filter(name => name !== parentComponentName && name.startsWith(parentComponentName));
    return children;
}
// Function to extract component details
function extractComponentDetails(sourceFile, typeChecker, allComponentNames) {
    const componentDetails = {};
    function visit(node) {
        let componentName;
        let type;
        if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        }
        else if (ts.isTypeAliasDeclaration(node) && node.name.text.endsWith('Props')) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        }
        else if (ts.isClassDeclaration(node) && node.name) {
            componentName = node.name.text;
            type = typeChecker.getTypeAtLocation(node);
        }
        if (componentName && type) {
            const isJsx = isReactElement(type, typeChecker);
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
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return componentDetails;
}
// Function to get all component names
function getAllComponentNames(sourceFiles) {
    const componentNames = [];
    sourceFiles.forEach(sourceFile => {
        function visit(node) {
            if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text.endsWith('Props')) {
                const componentName = node.name.text.replace('Props', '');
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
// Main function to extract all component details from TypeScript declaration files
function extractAllComponentDetails(directoryPath) {
    const files = getDeclarationFiles(directoryPath);
    const program = ts.createProgram(files, {});
    const typeChecker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles().filter(file => file.fileName.includes(directoryPath));
    const allComponentNames = getAllComponentNames(sourceFiles);
    const componentDetails = {};
    sourceFiles.forEach(sourceFile => {
        if (sourceFile.fileName == '/home/yash/Documents/Projects/my-app/node_modules/@craftjs/core/lib/editor/myjs.d.ts' ||
            sourceFile.fileName == '/home/yash/Documents/Projects/my-app/node_modules/@craftjs/core/lib/editor/myD..d.ts') {
            const detailsInFile = extractComponentDetails(sourceFile, typeChecker, allComponentNames);
            Object.assign(componentDetails, detailsInFile);
        }
    });
    // Output the details of each component
    Object.entries(componentDetails).forEach(([componentName, { props, importPath, children }]) => {
        console.log(`Component ${componentName}:`);
        console.log(`import ${componentName} from '${importPath}';`);
        if (Object.keys(props).length > 0) {
            Object.entries(props).forEach(([propName, propType]) => console.log(`- ${propName}: ${propType}`));
        }
        else {
            console.log('No props found.');
        }
        if (children.length > 0) {
            console.log(`Possible children components: ${children.join(', ')}`);
        }
    });
}
// Directory containing TypeScript declaration files for craft.js
// const directoryPath = path.join(__dirname, 'node_modules', '@craftjs', 'core');
const directoryPath = path.join('/home/yash/Documents/Projects/my-app', 'node_modules', '@craftjs', 'core');
if (fs.existsSync(directoryPath)) {
    extractAllComponentDetails(directoryPath);
}
else {
    console.log(`Directory not found: ${directoryPath}`);
}
//# sourceMappingURL=server.js.map