import { useEffect, useRef } from "react";

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    // return ref.current;
    return ref.current && value && ref.current != value;
};

export default usePrevious;
