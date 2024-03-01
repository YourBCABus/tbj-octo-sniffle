import { useEffect, useState } from "react";

const useInterval = (callback: () => void, ms: number) => {
    useEffect(() => {
        const interval = setInterval(callback, ms);
        return () => clearInterval(interval);
    })
    const [, rerender] = useState(0);
    return () => rerender(prev => prev + 1);
};

export const useIntervalValue = <T>(callback: () => T, ms: number) => {
    const [value, setValue] = useState(callback());
    useEffect(() => {
        const interval = setInterval(() => {
            setValue(callback());
        }, ms);
        return () => clearInterval(interval);
    }, [callback]);
    return value;
}

export const useAsyncIntervalValue = <T>(callback: () => Promise<T>, ms: number, defaultVal: T) => {
    const [value, setValue] = useState(defaultVal);
    useEffect(() => {
        const interval = setInterval(() => {
            callback().then(setValue);
        }, ms);
        return () => clearInterval(interval);
    }, [callback]);
    return value;
}

export default useInterval;

