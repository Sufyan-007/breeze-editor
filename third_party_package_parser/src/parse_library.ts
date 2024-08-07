import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';


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

// Function to extract component details
export function extractComponentDetails(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, allComponentNames: string[]): { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } {
    const componentDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};

    function visit(node: ts.Node) {
        let componentName: string | undefined;
        let type: ts.Type | undefined;

        if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        } else if (ts.isTypeAliasDeclaration(node) && node.name.text.endsWith('Props')) {
            componentName = node.name.text.replace('Props', '');
            type = typeChecker.getTypeAtLocation(node);
        } else if (ts.isClassDeclaration(node) && node.name) {
            componentName = node.name.text;
            type = typeChecker.getTypeAtLocation(node);
        }

        if (componentName && type) {
            const isJsx = isReactElement(type, typeChecker);
            const props = extractProps(type, typeChecker);

            const importPath = "";

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

// Main function to extract all component details from TypeScript declaration files
export function extractAllComponentDetails(directoryPath: string) {
    const files = getDeclarationFiles(directoryPath);

    const program = ts.createProgram(files, {});
    const typeChecker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles().filter(file => file.fileName.includes(directoryPath));

    const allComponentNames = getAllComponentNames(sourceFiles);

    const componentDetails: { [componentName: string]: { props: Record<string, string>, importPath: string, children: string[] } } = {};

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
        } else {
            console.log('No props found.');
        }
        if (children.length > 0) {
            console.log(`Possible children components: ${children.join(', ')}`);
        }
    });
}

