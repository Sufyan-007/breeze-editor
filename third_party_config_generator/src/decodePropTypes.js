const { TypeFlags } = require('ts-morph');
const { SyntaxKind } = require('typescript');
const { storeInfo, sanitizeFilePath } = require('./helper');
const { HandlePropTypes } = require('./handle_prop_types');

let max =0 ;

class DecodePropType{

    constructor(libraryName, storePath){
        this.libraryName = libraryName;
        this.storePath = storePath;
        this.handlePropTypes = new HandlePropTypes(libraryName, storePath);
    }

    decodeProps(prop, type, processed = [], recLevel=0, all=[]) {

        if(max < recLevel){
            max = recLevel;
            // console.log(max);
        }
        // console.log(recLevel);
        if(!type) return {
            'type' : 'UNDEFINED_UNKNOWN_TYPE'
            
        }
        if(all.includes(type.getText()) && (type.isInterface() || type.isObject())){
            // console.log('ALREADY_FOUND', type.getText());
        }else{
            all.push(type.getText())
        }
        // type._context.compilerFactory.getType(type.compilerType).getText()
    
        recLevel++;

        const typeInfo = {}
    
        if(typeof type.getKind == 'function' && type.getKind() == SyntaxKind.UnionType){
            typeInfo['type'] = 'UNION_TYPE'
            typeInfo['name'] = type.getText()
            typeInfo['data'] =  type.getTypeNodes().map(tn => this.decodeProps(prop, tn.getType(), processed, recLevel, all))
        }
        else if(type.getText() == 'object'){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'object'
        }
        else if(type.isNull()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'null'
    
        }else if(type.isUndefined()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'undefined'
    
        }
        else if(type.isLiteral()){
            typeInfo['type'] = 'LITERAL'
            typeInfo['data'] = type.getText()
        }
        else if(type.isString()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'string'
        }
        else if(type.isNumber()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'number' 
        }
        else if(type.getFlags() == TypeFlags.BigInt){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'bigint'
        }
        else if(type.isBoolean()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'boolean'
        }else if(type.isArray()){
            typeInfo['type'] = 'DATA_TYPE_ARRAY'
            typeInfo['data'] = this.decodeProps(prop, type.getArrayElementType(), processed, recLevel, all)
        }
        else if(type.isAny()){
            typeInfo['type'] = 'DATA_TYPE'
            typeInfo['data'] = 'any'
        }
        else if(type.isVoid()){
            typeInfo['type'] = 'DATA_TYPE',
            typeInfo['data'] = 'void'
        }
        else if(type.isTypeParameter()){
            typeInfo['type'] = 'TYPE_PARAMETER'
            typeInfo['data'] = this.decodeProps(prop, type.getDefault(), processed, recLevel, all )
        }
        else if(type.isInterface()){
            typeInfo['type'] = 'CUSTOM_INTERFACE'
            typeInfo['name'] = type.getText()
            
            let path = type.getSymbol()?.getValueDeclaration()?.getSourceFile().getFilePath()
            if(type.getText() == 'ArrayBufferView' || type.getText() == 'Promise'){
                // return
            }
            if(!path){
                const declarations = type.getSymbol().getDeclarations()
                for(const dec of declarations){
                    if(dec.getSourceFile()){
                        path = dec.getSourceFile().getFilePath()
                        // console.log('path', type.getText());
                        break;
                    }
                }
    
            }
    
            const objectPath = `${path}.${type.getText()}`
    
            // if(path == '/node_modules/typescript/lib/lib.dom.d.ts'){
            //     typeInfo['type'] = 'CUSTOM_OBJECT_INTERFACE'
            //      typeInfo['data'] = {
            //         refVariable : objectPath,
            //         refPath : path
            //      }
            // }
            // else
             if (processed.includes(objectPath)){
                // console.log('IGNORED', type.getText());
                 typeInfo['type'] = 'CUSTOM_INTERFACE'
                 typeInfo['data'] = {
                    refVariable : sanitizeFilePath(objectPath || ''),
                    refPath : sanitizeFilePath(path || '')
                 }
            }
            else{
                // if(path){
    
                    processed.push(objectPath)
                // }
    
    
                typeInfo['data'] = type.getProperties().map(p => {
                    // // // console.log('..', p.getValueDeclaration().getType().getDefault()?.getApparentType().isAny());
                    return {
                        name : p.getName(),
                        type : this.decodeProps(prop, p.getValueDeclaration().getType(), processed, recLevel, all)
                    }
                })
    
    
                if(path){
                    storeInfo(typeInfo, {
                        refVariable : sanitizeFilePath(`${path}.${type.getSymbol()?.getName() || type.getText()}`),
                        refPath : sanitizeFilePath(path)
                    },  `${this.storePath}/${this.libraryName}`)
                    typeInfo['data'] = {
                        refVariable :sanitizeFilePath(objectPath),
                        refPath : sanitizeFilePath(path)
                     
                    }
    
                      
                }
    
            }
    
            // // // console.log('Interface found', type);
        }
        else if(type.isUnion()){
            // // console.log('1111111');
            typeInfo['type'] = 'UNION_TYPE'
            typeInfo['name'] = type.getText()
            typeInfo['data'] = []
    
            let declaration = null
            // if(type.getSymbol()){
                // declaration = 
                if(type.getAliasSymbol()?.getDeclarations().length > 0){
                    // console.log('HERE');
                    declaration = type.getAliasSymbol().getDeclarations()[0]
                        
                        const types = declaration.getTypeNode()
    
                        const path = declaration.getSourceFile().getFilePath()
                        const objectPath = `${path}.${type.getText()}`
    
                        if(processed.includes(objectPath)){
                            // console.log('ALREADY FOUND SO INGORED', type.getText());
                            typeInfo['type'] = 'CUSTOM_TYPE_TYPE'
                            typeInfo['data'] = {
                                refVariable : sanitizeFilePath(objectPath || ''),
                                refPath : sanitizeFilePath(path || '')
                            }
                        }else{
                            if(path){
                                processed.push(objectPath)
                            }
                        // if(declaration.getSourceFile().getFilePath())
                        
                        if(types.getKind() == SyntaxKind.UnionType){
    
                            for(const ut of types.getTypeNodes()){
                                let type = ut
                                // if(type.constructor.name == 'Expression'){
                                    type = type.getType()
                                // }
                                typeInfo['data'].push(this.decodeProps(prop, type, processed, recLevel, all))
                            }
                        }else{
    
                            
                            for(const ut of type.getUnionTypes()){
    
                                typeInfo['data'].push(this.decodeProps(prop, ut, processed, recLevel, all))
                            }
                        }
                    }
    
                    
                }else{
    
                    let types = [];
                        
                    const compilerFactory = type._context.compilerFactory;
                    
                    if(type.compilerType.origin && type.compilerType.origin.types) {
                        types = type.compilerType.origin?.types.map(originType => compilerFactory.getType(originType)) || [];
                    }else{
                        types = type.getUnionTypes()
                        }
    
    
                    for(const ut of types){
                        typeInfo['data'].push(this.decodeProps(prop, ut, processed, recLevel, all))
                    }
    
                }
            // }
        }else if(type.getCallSignatures().length > 0){
            // // // console.log('FUNCTION DEC');
            const callSign = type.getCallSignatures()[0]
            const params = callSign.getParameters()
            typeInfo['type'] = 'FUNCTION'
            typeInfo['data'] = { 
                    returnType : {
                        name : callSign.getReturnType().getText(),
                        type : this.decodeProps(prop, callSign.getReturnType(), processed, recLevel, all)
                    },
    
                parameters : {
                    destructured : false,
                    list: params.map(p => {
                        // // // console.log('==', p.getValueDeclaration().getType().getSymbol()?.getDeclaredType().isInterface());
    
                        // // // console.log('==', p.getValueDeclaration().getType().isObject());
                        return {
                                name : p.getName(),
                            type : this.decodeProps(prop, p.getValueDeclaration().getType(), processed, recLevel, all)
                        }}
                    )
                } 
            }
        }
        else if(type.isObject()){
            // // console.log('OBJECT FOUND', type.getSymbol().getDeclaredType());
            // typeInfo['type'] = 'CUSTOM_OBJECT'
            // typeInfo['data'] = type.getSymbol().getDeclaredType().getText()
    
            const path = type.getSymbol()?.getValueDeclaration()?.getSourceFile().getFilePath()
            const objectPath = `${path}.${type.getText()}`
    
            // if(path == '/node_modules/typescript/lib/lib.dom.d.ts'){
            //     typeInfo['type'] = 'CUSTOM_OBJECT_TYPESCRIPT'
            //      typeInfo['data'] = {
            //         refVariable : objectPath,
            //         refPath : path
            //      }
            // }
            // else 
            if (processed.includes(objectPath)){
                 typeInfo['type'] = 'CUSTOM_OBJECT'
                 typeInfo['data'] = {
                    refVariable : sanitizeFilePath(objectPath || ''),
                    refPath : sanitizeFilePath(path || '')
                 }
            }
            else{
                // if(path){
                    processed.push(objectPath)
                // }
                return this.decodeProps(prop, type.getSymbol()?.getDeclaredType(), processed, recLevel, all)
            }
        }else{
            typeInfo['type'] = 'UNKNOWN'
            typeInfo['data'] = type.getText()
        }
    
        return typeInfo
    
    
    
    
        // if (prop.getTypeNode().getKind() == SyntaxKind.TypeReference) {
        //     // // console.log('TYPE REFERENCE FOUND');
        //     if (prop.getTypeNode().getType().isUnion()) {
        //         for (const up of prop.getTypeNode().getType().getUnionTypes()) {
        //             // // console.log(up.isString());
        //             if (up.isString()) {
        //                 // // console.log('STTING TYPE');
        //             }
        //             if (up.isArray()) {
        //                 // // console.log('sdf', up.getArrayElementType().isString());
        //             }
        //         }
        //     }
        //     // // console.log(prop.getTypeNode().getType().getUnionTypes().map(t => t.isStringLiteral()));
        //     // // console.log(prop.getTypeNode().getType().getSymbol());
        // }
    
    }
       
}

module.exports = {
    DecodePropType
}