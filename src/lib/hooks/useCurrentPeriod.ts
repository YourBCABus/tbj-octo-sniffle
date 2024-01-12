import { useEffect, useState } from 'react';
import { Period } from '../types/types';
import { getCurrentPeriod } from '../time';

const useCurrentPeriod = (
    data: { periods: Period[] } | undefined,
    pollingPeriod?: number,
): Period | null => {
    const [currPeriod, setCurrPeriod] = useState<Period | null>(null);

    useEffect(() => {
        if (!data) {
            setCurrPeriod(null);
            return;
        }
        const interval = setInterval(() => {
            setCurrPeriod(getCurrentPeriod(data.periods));
        }, pollingPeriod ?? 10000);

        setCurrPeriod(getCurrentPeriod(data.periods));

        return () => clearInterval(interval);
    }, [data, pollingPeriod]);

    return currPeriod;
};

export default useCurrentPeriod;
