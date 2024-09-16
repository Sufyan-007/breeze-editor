const { SyntaxKind } = require('typescript');
const { Node, TypeParameter } = require('ts-morph');


class FindDeclaration {
    constructor() {
        // this.propName = propName;
        // this.sourceFile = sourceFile;
    }

    getDeclaration(propName, sourceFile) {
        this.propName = propName;
        this.sourceFile = sourceFile;

        const declaration = this.getIfInterface() ||
            this.getIfType() ||
            this.getIfImportDeclaration() ||
            this.getIfImportDeclarationWithStarAs() ||
            this.getIfExportDeclaration() ||
            this.getIfFunction() ||
            this.getIfModuleOrNamespace() ||
            this.getIfClass() ||
            this.getIfVariableDeclaration();

        return declaration;

    }

    getIfImportDeclaration() {
        const relatedImport = this.sourceFile.getImportDeclaration(i => i.getNamedImports().find(n => n.getName() === this.propName))
        // // // // console.log(relatedImport.getNamedImports().find(n => n.getName() === propName).getNameNode().getDefinitionNodes()[0]);
        const propVar = relatedImport?.getNamedImports().find(n => n.getName() === this.propName)?.getNameNode().getDefinitionNodes()[0];

        return propVar;

    }

    getIfImportDeclarationWithStarAs() {
        const relatedImport = this.sourceFile.getImportDeclaration(i => i.getStructure().namespaceImport === this.propName);
        return relatedImport?.getNamespaceImport();
    }

    getIfExportDeclaration() {
        // Try to find the variable which is written like
        // export type { AnchorProps }; and it's imported from other file
        // Other way can be we can search for imports
        const relatedExportDeclaration = this.sourceFile.getExportDeclaration(d => d.getNamedExports().find(n => n.getName() === this.propName));

        const propVar = relatedExportDeclaration?.getNamedExports().find(n => n.getName() === this.propName).getNameNode().getDefinitionNodes()[0]

        return propVar;
    }

    getIfType() {
        const typeNode = this.sourceFile.getTypeAlias(this.propName)?.getTypeNode()
        if (typeNode) {
            if (typeNode.getKind() == SyntaxKind.UnionType) {
                // console.log('UNION TYPE NODE');
                // console.log(typeNode.getTypeNodes().map(t => t.getText()));
                // NEED to handle all the type of union type : REFER FORM LABEL
                // Temporarily returing one 

                const relatedSourceFile = typeNode.getTypeNodes()[0].getSourceFile() || this.sourceFile;

                if ((typeof typeNode.getTypeNodes()[0].getTypeArguments == 'function') && typeNode.getTypeNodes()[0].getTypeArguments().length > 0) {

                    if (typeNode.getTypeNodes()[0].getTypeArguments().length > 0) {
                        return this.getDeclaration(typeNode.getTypeNodes()[0].getTypeName().getText(), this.sourceFile);
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
                return this.getDeclaration(typeNode.getTypeNodes()[0].getText(), relatedSourceFile);
            } else if (typeNode.getKind() == SyntaxKind.IntersectionType) {
                return typeNode;
            } else if (typeNode.getKind() == SyntaxKind.TupleType) {
                return typeNode;
            } else {
                return typeNode;
            }
        }

    }


    getIfInterface() {
        return this.sourceFile.getInterface(this.propName);
    }

    getIfClass() {
        return this.sourceFile.getClass(this.propName);
    }

    getIfVariableDeclaration() {
        return this.sourceFile.getVariableDeclaration(this.propName);
    }

    getIfModuleOrNamespace() {
        return this.sourceFile.getModule(this.propName);
    }

    getIfFunction() {
        return this.sourceFile.getFunction(this.propName);
    }
}

module.exports = {
    FindDeclaration
}