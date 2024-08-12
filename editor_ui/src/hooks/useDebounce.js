import React from "react";

function useDebounce() {
  return (func, milliSeconds) => {
    let timer;
    console.log('debounce timer');
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, arguments);
      }, milliSeconds);
    };
  };
}

export default useDebounce;
