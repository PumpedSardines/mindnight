import { useEffect, useState } from "react";

function useDebounce(ms: number) {
  const [func, setFunc] = useState(() => () => {});

  useEffect(() => {
    const id = setTimeout(() => {
      func();
    }, ms);

    return () => {
      clearTimeout(id);
    };
  }, [func, ms]);

  return (cb: () => void) => {
    setFunc(() => cb);
  };
}

export default useDebounce;
