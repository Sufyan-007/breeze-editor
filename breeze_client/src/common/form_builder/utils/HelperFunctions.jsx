const getDynamicValue = (value, pathOrValue, isDynamic) => {
  if (isDynamic) {
    return getNestedValue(value, pathOrValue);
  }
  return pathOrValue;
};

const getNestedValue = (obj, path) => {
  if (!path.includes('.')) {
    return obj[path];
  }
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const evaluateUnaryCondition = (condition, value) => {
  const { operand, operandValue, operator, operandValueIsDynamic } = condition;
  const fieldValue = getNestedValue(value, operand);
  const dynamicValue = getDynamicValue(value, operandValue, operandValueIsDynamic);

  switch (operator) {
    case '!==':
      return fieldValue !== dynamicValue;
    case '===':
      return fieldValue === dynamicValue;
    case '==':
      return fieldValue == dynamicValue;
    case '!=':
      return fieldValue != dynamicValue;
    case '!':
      return fieldValue !== dynamicValue;
    default:
      return false;
  }
};

const evaluateBinaryCondition = (condition, value) => {
  const {
    leftOperand,
    leftOperandValue,
    rightOperand,
    rightOperandValue,
    operator,
    rightOperandIsDynamic,
    leftOperandIsDynamic,
  } = condition;
  const leftValue = getDynamicValue(value, leftOperand ? leftOperand : leftOperandValue, leftOperandIsDynamic);
  const rightValue = getDynamicValue(value, rightOperand ? rightOperand : rightOperandValue, rightOperandIsDynamic);

  switch (operator) {
    case '===':
      return leftValue === rightValue;
    case '!==':
      return leftValue !== rightValue;
    case '<':
      return parseFloat(leftValue) < parseFloat(rightValue);
    case '>':
      return parseFloat(leftValue) > parseFloat(rightValue);
    case '<=':
      return parseFloat(leftValue) <= parseFloat(rightValue);
    case '>=':
      return parseFloat(leftValue) >= parseFloat(rightValue);
    default:
      return false;
  }
};

export const evaluateConditions = (conditions, value, operation, otherStates) => {
  const results = conditions.map((cond) => {
    console.log(cond.conditionType, 'conditionType');
    if (cond.conditionType === 'ORDINARY') {
      if (cond.type === 'UNARY') {
        return evaluateUnaryCondition(cond, value);
      } else if (cond.type === 'BINARY') {
        return evaluateBinaryCondition(cond, value);
      }
    } else if (cond.conditionType === 'OTHERSTATE') {
      return otherStates[cond.operand];
    }
    return false;
  });

  if (operation === 'ANY') {
    return results.some((result) => result);
  } else if (operation === 'ALL') {
    return results.every((result) => result);
  }

  return false;
};
