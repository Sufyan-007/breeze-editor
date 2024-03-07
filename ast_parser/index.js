const parser = require('flow-parser');
// const parser = require("@babel/parser");


const get_ast = (code) => {
    // console.log(code)
    const ast = parser.parse(`${code}`, {
        flow: { }
    });
    
    console.log(JSON.stringify(ast, null, 2));

    // console.log(JSON.stringify(ast, null, 2));

    // const ast = parser.parse(code, {
    //   sourceType: "module",
    //   plugins: [
    //     "jsx", // Add any additional plugins you need (e.g., "typescript")
    //     "typescript",
    //   ],
    // });
    
    // console.log(JSON.stringify(ast, null, 2));
}


const js_code = `
import * as React from 'react';
import classNames from 'classnames';
import { useBootstrapPrefix } from './ThemeProvider';
import divWithClassName from './divWithClassName';
import type { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

const DivStyledAsH4 = divWithClassName('h4');
DivStyledAsH4.displayName = 'DivStyledAsH4';

export interface AlertHeadingProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}

export class ANS {
  
}

const AlertHeading: BsPrefixRefForwardingComponent<'div', AlertHeadingProps> =
  React.forwardRef<HTMLElement, AlertHeadingProps>(
    ({ className, bsPrefix, as: Component = DivStyledAsH4, ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'alert-heading');
      return (
        <Component
          ref={ref}
          className={classNames(className, bsPrefix)}
          {...props}
        />
      );
    },
  );

AlertHeading.displayName = 'AlertHeading';

export const a = {
  "a" : 2
};

export default AlertHeading;

`


// console.log(js_code);
// console.log("----------------JS")
// console.log(process.argv)
// Check if a function name is provided as a command-line argument
if (process.argv.length >= 3) {
  var functionName = process.argv[2];
  

  // Call the specified function with additional arguments if provided
  if (functionName === "get_ast" && process.argv.length >= 4) {
    get_ast(process.argv[3]);
  }
}

// const ast_str = get_ast(js_code)

// console.log(ast_str)
