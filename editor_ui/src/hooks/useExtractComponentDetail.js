import { Parser } from 'acorn';
import { simple, base } from 'acorn-walk';
import jsx from 'acorn-jsx';

// JSXElement
// JSXOpeningElement
// JSXIdentifier
// JSXClosingElement
// JSXExpressionContainer

// missing
// JSXText
// JSXAttribute

  // babel's visitor types
  // JSXAttribute?: ExplVisitNode<S, t.JSXAttribute>;
  // JSXClosingElement?: ExplVisitNode<S, t.JSXClosingElement>;
  // JSXClosingFragment?: ExplVisitNode<S, t.JSXClosingFragment>;
  // JSXElement?: ExplVisitNode<S, t.JSXElement>;
  // JSXEmptyExpression?: ExplVisitNode<S, t.JSXEmptyExpression>;
  // JSXExpressionContainer?: ExplVisitNode<S, t.JSXExpressionContainer>;
  // JSXFragment?: ExplVisitNode<S, t.JSXFragment>;
  // JSXIdentifier?: ExplVisitNode<S, t.JSXIdentifier>;
  // JSXMemberExpression?: ExplVisitNode<S, t.JSXMemberExpression>;
  // JSXNamespacedName?: ExplVisitNode<S, t.JSXNamespacedName>;
  // JSXOpeningElement?: ExplVisitNode<S, t.JSXOpeningElement>;
  // JSXOpeningFragment?: ExplVisitNode<S, t.JSXOpeningFragment>;
  // JSXSpreadAttribute?: ExplVisitNode<S, t.JSXSpreadAttribute>;
  // JSXSpreadChild?: ExplVisitNode<S, t.JSXSpreadChild>;
  // JSXText?: ExplVisitNode<S, t.JSXText>;


const baseWithJSX = {
    ...base,
    JSXElement(node, state, c) {
      c(node.openingElement, state);
      if (node.closingElement) c(node.closingElement, state);
      if (node.children) node.children.forEach(child => c(child, state));
    },
    JSXOpeningElement(node, state, c) {
      c(node.name, state);
      if (node.attributes) node.attributes.forEach(attr => c(attr, state));
    },
    JSXClosingElement(node, state, c) {
      c(node.name, state);
    },
    JSXIdentifier(node, state, c) {},
    JSXExpressionContainer(node, state, c) {
      c(node.expression, state);
    },
    JSXText(node, state, c) {
      // Handle JSX text nodes
    },
    JSXAttribute(node, state, c) {
      c(node.name, state);
      if (node.value) c(node.value, state);
    }
  };
  
  export function parseReactComponent(code) {
    const ast = Parser.extend(jsx()).parse(code, { ecmaVersion: 2020, sourceType: 'module' });
    // console.log("------------ast-----------");
    // console.log(ast);
    // console.log("------------base-----------");
    // console.log(base);
    // console.log("------------baseWithJsx-----------");
    // console.log(baseWithJSX);
    // const details = {
    //   imports: [],
    //   variables: [],
    //   functions: [],
    //   jsxElements: new Set(),
    // };
  
    // simple(ast, {
    //     // ...base,
    //     // JSXElement: () => {},
    //     ImportDeclaration(node) {
    //         console.log('node-----import');
    //         console.log(node);
    //       details.imports.push(node.source.value);
    //     },
    //     VariableDeclarator(node) {
    //         console.log('node-----VD');
    //         console.log(node);
    //       details.variables.push(node.id.name);
    //     },
    //     FunctionDeclaration(node) {
    //         console.log('node-----FD');
    //         console.log(node);
    //       details.functions.push(node.id.name);
    //     },
    //   // ReturnStatement(node) {
    //   //   // const elementName = node.name.name;
    //   //   // if (elementName) {
    //   //   //   details.jsxElements.add(elementName);
    //   //   // }
    //   //   console.log('node-----JSX');
    //   //   console.log(node);
    //   // },
    //     JSXElement(node) {
    //       console.log('node-----JSX');
    //       console.log(node);
    //     }

    // }, baseWithJSX);

    const details = {
      imports: [],
      variables: [],
      functions: [],
      jsxElements: new Set(),
      props: {},
      functionParams: {},
    };
  
    simple(ast, {
      ImportDeclaration(node) {
        details.imports.push(node.source.value);
      },
      VariableDeclarator(node) {
        details.variables.push(node.id.name);
      },
      FunctionDeclaration(node) {
        details.functions.push(node.id.name);
        details.functionParams[node.id.name] = node.params.map(param => param.name);
      },
      JSXOpeningElement(node) {
        const elementName = node.name.name;
        if (elementName) {
          details.jsxElements.add(elementName);
        }
        // Extract props and their values
        node.attributes.forEach(attr => {
          if (attr.type === 'JSXAttribute' && attr.value) {
            const propName = attr.name.name;
            const propValue = attr.value.expression ? attr.value.expression.name : attr.value.value;
            if (!details.props[elementName]) {
              details.props[elementName] = {};
            }
            details.props[elementName][propName] = propValue;
          }
        });
      }
    }, baseWithJSX);
    
      console.log('outside');
  
    return {
      ...details,
      jsxElements: Array.from(details.jsxElements),
    };
  }

// Example usage
// const code = `
//   import React, { useState, useEffect } from 'react';
//   import OtherComponent from './OtherComponent';

//   function ExampleComponent() {
//     const [state, setState] = useState(0);
//     useEffect(() => {
//       console.log(state);
//     }, [state]);

//     function handleClick() {
//       setState(state + 1);
//     }

//     return (
//       <div>
//         <button onClick={handleClick}>Increment</button>
//         <span>{state}</span>
//       </div>
//     );
//   }
// `;

// const details = parseReactComponent(code);
// console.log(details);
