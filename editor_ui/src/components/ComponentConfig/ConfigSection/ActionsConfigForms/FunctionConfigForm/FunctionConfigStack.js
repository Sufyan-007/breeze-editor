import Assignment from "./StatementTypes/Assignment";
import CustomCode from "./StatementTypes/CustomCode";
import Declaration from "./StatementTypes/Declaration";
import IfBlock from "./StatementTypes/IfBlock";
import Return from "./StatementTypes/Return";
import WhileBlock from "./StatementTypes/WhileBlock";
import Block from "./StatementTypes/Block";
import DoWhileBlock from "./StatementTypes/DoWhileBlock";
import FunctionCall from "./StatementTypes/FunctionCall";
import TryCatch from "./StatementTypes/TryCatch";
import ChainedFunctionCall from "./StatementTypes/ChainedFunctionCall";
import FunctionType from "./StatementTypes/FunctionType";

const typeMapping = {
  BLOCK: Block,
  WHILE_BLOCK: WhileBlock,
  IF_BLOCK: IfBlock,
  RETURN: Return,
  DECLARATION: Declaration,
  CUSTOM: CustomCode,
  ASSIGNMENT: Assignment,
  DO_WHILE_BLOCK: DoWhileBlock,
  FUNCTION_CALL: FunctionCall,
  TRY_CATCH: TryCatch,
  CHAINED_FUNCTIONS: ChainedFunctionCall,
  FUNCTION: FunctionType,
};

export default function FunctionConfigStack({ config, updateParent }) {
  const Type = typeMapping[config.type];

  return <Type config={config} updateParent={updateParent} />;
}
