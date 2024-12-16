export type FunctionParam = {
    name: string;
    type: string|undefined;
    default_value: string;
    isOptional:boolean;
    id: string;
  };

export type FunctionParamsRecord = Record<string,FunctionParam>;

export type VariableDetails = {
    varName:string;
    value:{type:string|null,value:string|null},
    _id:string;
    declarationType:string,
    filePath:string,
    dataType:string|undefined
}
export type TagAndItsComment = {
  tagName:string,
  comment:string|undefined
}

export type VaribaleListRecord = Record<string,VariableDetails>

export type FunctionDescription = {
  functionText:string,
  uses:string|undefined,
  tagsAndItsComment:TagAndItsComment[],
  willUseAIDesc:boolean
}

export type FunctionText = {
  _id:string,
  functionText:string
}