import { useState, useEffect } from "react";
import { Parser } from "acorn";
import { simple } from "acorn-walk";
import jsx from "acorn-jsx";

export function useExtractFunctionDetails() {
//   const [func, setFunction] = useState('');
//   const [details, setDetails] = useState({
//     variables: [],
//     functions: [],
//     hooks: [],
//     jsxElements: [],
//   });

//   useEffect(() => {
//     console.log(func);
//     if (func) {
//       const code = func.toString();
//       const ast = Parser.extend(jsx()).parse(code, { ecmaVersion: 2020, sourceType: "module" });

//       console.log("ast: ", ast);
//       const extractedDetails = {
//         variables: new Set(),
//         functions: new Set(),
//         hooks: new Set(),
//         jsxElements: new Set(),
//       };
  
//       simple(ast, {
//         VariableDeclarator(node) {
//           extractedDetails.variables.add(node.id.name);
//         },
//         CallExpression(node) {
//           const callee = node.callee.name;
//           if (callee) {
//             extractedDetails.functions.add(callee);
//             if (callee.startsWith("use")) {
//               extractedDetails.hooks.add(callee);
//             }
//           }
//         },
//         JSXOpeningElement(node) {
//           const elementName = node.name.name;
//           if (elementName) {
//             extractedDetails.jsxElements.add(elementName);
//           }
//         },
//       });
  
//       setDetails({
//         variables: Array.from(extractedDetails.variables),
//         functions: Array.from(extractedDetails.functions),
//         hooks: Array.from(extractedDetails.hooks),
//         jsxElements: Array.from(extractedDetails.jsxElements),
//       });
//     }
//   }, [func]);

//   return [details, setFunction];
// }


  const [func, setFunction] = useState('');
  const [details, setDetails] = useState({
    localVariables: [],
    outerScopeVariables: [],
    functions: [],
    hooks: [],
    jsxElements: [],
  });

  useEffect(() => {
    const code = func.toString();
    const ast = Parser.extend(jsx()).parse(code, { ecmaVersion: 2020, sourceType: "module" });
    
    

    const localVars = new Set();
    const outerVars = new Set();
    const identifiers = new Set();
    const properties = new Set();
    const functions = new Set();
    const funcs = new Set();
    const members = new Set();
    const hooks = new Set();
    const jsxElems = new Set();
    
    simple(ast, {
      VariableDeclarator(node) {
        localVars.add(node.id.name);
        
        
      },
      CallExpression(node) {
        const callee = node.callee.name;
        if (callee) {
          if (callee.startsWith('use')) {
            hooks.add(callee);
          } else {
            funcs.add(callee);
          }
        }
        
        
      },
      FunctionDeclaration(node) {},
      FunctionExpression(node) {},
      MemberExpression(node) {
        const memberExpression = node.object.name;
        if (memberExpression) 
            members.add(memberExpression);
        
        
      },
      Identifier(node) {
        if (!localVars.has(node.name) && !funcs.has(node.name) && !hooks.has(node.name)) {
          // outerVars.add(node.name);
          identifiers.add(node.name)
        }
        
        
      },
      Property(node) {
        if (node.value.name) {
          properties.add(node.value.name)
        }
      },

      JSXOpeningElement(node) {
        const elementName = node.name.name;
        if (elementName) {
          jsxElems.add(elementName);
        }
        
        
      },
    });

    console.log("-------------ast----------------");
    console.log(ast);
    console.log("-------------node--VD--------------");
    console.log(localVars);
    console.log("-------------node--CalleeFunc--------------");
    console.log(funcs);
    console.log("-------------node--CalleeHooks--------------");
    console.log(hooks);
    console.log("-------------node--Member--------------");
    console.log(members);
    console.log("-------------node--ID--------------");
    console.log(identifiers);
    console.log("-------------node--properties--------------");
    console.log(properties);
    console.log("-------------node--JSX--------------");
    console.log(jsxElems);

    setDetails({
      localVariables: Array.from(localVars),
      outerScopeVariables: Array.from(identifiers).filter(item => {
        return !localVars.has(item) && !funcs.has(item) && !hooks.has(item);
      }),
      functions: Array.from(funcs),
      hooks: Array.from(hooks),
      jsxElements: Array.from(jsxElems),
    });
  }, [func]);

  return [details, setFunction];
}
