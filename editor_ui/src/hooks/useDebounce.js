import React from "react";

function useDebounce() {
  return (func, milliSeconds) => {
    let timer;
    return (...args) => {      
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;        
        func.apply(this, args);
        console.log(args);
      }, milliSeconds);
    };
  };
}

export default useDebounce;
