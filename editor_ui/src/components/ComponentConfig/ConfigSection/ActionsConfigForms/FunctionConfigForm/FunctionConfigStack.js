import Assignment from "./StatementTypes/Assignment";
import CustomCode from "./StatementTypes/CustomCode";
import Declaration from "./StatementTypes/Declaration";
import IfBlock from "./StatementTypes/IfBlock";
import Return from "./StatementTypes/Return";
import WhileBlock from "./StatementTypes/WhileBlock";
import Block from "./StatementTypes/Block";
import DoWhileBlock from "./StatementTypes/DoWhileBlock";

const typeMapping = {
  BLOCK: Block,
  WHILE_BLOCK: WhileBlock,
  IF_BLOCK: IfBlock,
  RETURN: Return,
  DECLARATION: Declaration,
  CUSTOM: CustomCode,
  ASSIGNMENT: Assignment,
  DO_WHILE_BLOCK: DoWhileBlock,
};

export default function FunctionConfigStack({ config, updateParent }) {
  const Type = typeMapping[config.type];

  return <Type config={config} updateParent={updateParent} />;
}
