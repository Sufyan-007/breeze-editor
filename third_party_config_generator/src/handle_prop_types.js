const { TypeFlags } = require('ts-morph');
const { SyntaxKind } = require('typescript');


let max = 0;
function handlePropTypes(prop, type, processed = [], recLevel = 0, all = []) {

    // This if for checking the recursion level, which occurs while processing
    // if(max < recLevel){
    //     max = recLevel;
    //     console.log(max);
    // }

    // recLevel++;


    // If type is undefined return 
    if (!type) return { 'type': 'UNDEFINED_UNKNOWN_TYPE' };

    // This is for testing purpose for checking if any loop happens because 
    // of same variable getting decoded multiple times
    // One variable should be processed one time only and after that there should 
    // be only references to that given
    // if(all.includes(type.getText()) ){
    //     if (type.isInterface() || type.isObject()){
    //         console.log('ALREADY_FOUND', type.getText());
    //     }
    // }else{
    //     all.push(type.getText())
    // }

    const typeInfo = {};

    if (typeof type.getKind === 'function' && type.getKind() === SyntaxKind.UnionType) {
        typeInfo['type'] = 'UNION_TYPE'
        typeInfo['name'] = type.getText()
        typeInfo['data'] = type.getTypeNodes().map(tn => handlePropTypes(prop, tn.getType(), processed, recLevel, all))

        return typeInfo;
    }

    // Handle all the cases
    switch (true) {
        case type.getText() === 'object':
            return { 'type': 'DATA_TYPE', 'data': 'object' };
        case type.isNull():
            return { 'type': 'DATA_TYPE', 'data': 'null' };
        case type.isUndefined():
            return { 'type': 'DATA_TYPE', 'data': 'undefined' };
        case type.isLiteral():
            return { 'type': 'LITERAL', 'data': type.getText() };
        case type.isString():
            return { 'type': 'DATA_TYPE', 'data': 'string' };
        case type.isNumber():
            return { 'type': 'DATA_TYPE', 'data': 'number' };
        case type.getFlags() === TypeFlags.BigInt:
            return { 'type': 'DATA_TYPE', 'data': 'bigint' };
        case type.isBoolean():
            return { 'type': 'DATA_TYPE', 'data': 'boolean' };
        case type.isArray():
            return { 'type': 'DATA_TYPE_ARRAY', 'data': handlePropTypes(prop, type.getArrayElementType(), processed, recLevel, all) };
        case type.isAny():
            return { 'type': 'DATA_TYPE', 'data': 'any' };
        case type.isVoid():
            return { 'type': 'DATA_TYPE', 'data': 'void' };
        case type.isTypeParameter():
            return { 'type': 'TYPE_PARAMETER', 'data': handlePropTypes(prop, type.getDefault(), processed, recLevel, all) };
        case type.isInterface():
            return decodeInterfaceType(prop, type, processed, recLevel, all);
        case type.isUnion():
            return decodeUnionType(prop, type, processed, recLevel, all);
        case type.getCallSignatures().length > 0:
            return decodeFunctionType(prop, type, processed, recLevel, all);
        case type.isObject():
            return decodeObjectType(prop, type, processed, recLevel, all);
        default:
            return { 'type': 'UNKNOWN', 'data': type.getText() };
    }


    return typeInfo;
}

// Handle Interface Type
function decodeInterfaceType(prop, type, processed, recLevel, all) {
    const typeInfo = {}
    typeInfo['type'] = 'CUSTOM_INTERFACE'
    typeInfo['name'] = type.getText()

    // Try to check if variable is already processed
    let alreadyProcessed = checkAlreadyProcessed(type, type.getSymbol()?.getValueDeclaration(), processed)

    if (!alreadyProcessed.isAlreadyProcessed) {
        const declarations = type.getSymbol().getDeclarations()
        for (const dec of declarations) {
            if (dec.getSourceFile()) {
                alreadyProcessed = checkAlreadyProcessed(type, dec, processed)
                break;
            }
        }
    }

    // If already processed then return
    if (alreadyProcessed.isAlreadyProcessed) {
        return {
            type: 'CUSTOM_INTERFACE',
            data: alreadyProcessed.data
        }
    }

    // Go through all the properties of the interface and decode them
    typeInfo['data'] = type.getProperties().map(p => {
        return {
            name: p.getName(),
            type: handlePropTypes(prop, p.getValueDeclaration().getType(), processed, recLevel, all)
        }
    })

    return typeInfo;

}


// Handle Function Type
function decodeFunctionType(prop, type, processed, recLevel, all) {

    const typeInfo = {}
    const callSign = type.getCallSignatures()[0]
    const params = callSign.getParameters()
    typeInfo['type'] = 'FUNCTION'

    // Get details about the function return types and parameters
    typeInfo['data'] = {
        returnType: {
            name: callSign.getReturnType().getText(),
            type: handlePropTypes(prop, callSign.getReturnType(), processed, recLevel, all)
        },

        parameters: {
            destructured: false,
            list: params.map(p => {
                return {
                    name: p.getName(),
                    type: handlePropTypes(prop, p.getValueDeclaration().getType(), processed, recLevel, all)
                }
            }
            )
        }
    }

    return typeInfo;
}

// Handle Object Type
function decodeObjectType(prop, type, processed, recLevel, all) {

    // Check if object is already processed
    const alreadyProcessed = checkAlreadyProcessed(type, type.getSymbol()?.getValueDeclaration(), processed)

    // If already processed then dont process it, just give reference to it
    if (alreadyProcessed.isAlreadyProcessed) {
        return {
            type: 'CUSTOM_OBJECT',
            data: alreadyProcessed.data
        }
    }

    return handlePropTypes(prop, type.getSymbol()?.getDeclaredType(), processed, recLevel, all)

}

function decodeUnionType(prop, type, processed, recLevel, all) {

    const typeInfo = {};
    typeInfo['type'] = 'UNION_TYPE'
    typeInfo['name'] = type.getText()
    typeInfo['data'] = []


    // Try to find declaration for the variable, to check if it is already processed
    if (type.getAliasSymbol()?.getDeclarations().length > 0) {
        const declaration = type.getAliasSymbol().getDeclarations()[0]

        // Check if it is already processed
        const alreadyProcessed = checkAlreadyProcessed(type, declaration, processed)

        if (alreadyProcessed.isAlreadyProcessed) {
            return {
                type: 'CUSTOM_TYPE_TYPE',
                data: alreadyProcessed.data
            }
        }

        // If not already processed
        // Loop through all the types of the Union and decode it
        const types = declaration.getTypeNode()

        if (types.getKind() == SyntaxKind.UnionType) {
            typeInfo['data'] = types.getTypeNodes().map(tn => handlePropTypes(prop, tn.getType(), processed, recLevel, all))
        } else {
            typeInfo['data'] = type.getUnionTypes().map(ut => handlePropTypes(prop, ut, processed, recLevel, all))
        }
    } else { // If not able to find declaration, directly try to decode all types of union
        typeInfo['data'] = type.getUnionTypes().map(ut => handlePropTypes(prop, ut, processed, recLevel, all))
    }

    return typeInfo;
}

function generateObjectPath(type) {
    const symbol = type.getSymbol();
    if (!symbol) return null;

    const valueDeclaration = symbol.getValueDeclaration();
    if (!valueDeclaration) return null;

    const sourceFile = valueDeclaration.getSourceFile();
    if (!sourceFile) return null;

    const filePath = sourceFile.getFilePath();
    const objectPath = `${filePath}.${type.getText()}`;

    return {
        'refVariable': objectPath,
        'refPath': filePath
    };
}


function checkAlreadyProcessed(type, declaration, processedArr) {

    const typeInfo = {}
    const path = declaration?.getSourceFile().getFilePath()
    const objectPath = `${path}.${type.getText()}`

    // Use this if you dont want to resolve the inbuilt files
    // if(path == '/node_modules/typescript/lib/lib.dom.d.ts'){
            // return {referenceVars}
    // }

    if (processedArr.includes(objectPath)) {
        // console.log('ALREADY FOUND SO INGORED33', type.getText());
        // typeInfo['type'] = 'CUSTOM_TYPE_TYPE'
        typeInfo['data'] = {
            refVariable: objectPath,
            refPath: path
        }

        return {
            isAlreadyProcessed: true,
            data: typeInfo['data']
        }
    } else {
        if (path) {
            processedArr.push(objectPath)
        }

    }

    // It will reach here if only it doesnt already exists so add the path
    // We are checking path because if it is undefined we are not able to find the file

    return {
        isAlreadyProcessed: false
    }

}

module.exports = {
    handlePropTypes
}
