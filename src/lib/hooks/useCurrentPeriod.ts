import { useEffect, useState } from 'react';
import { Period } from '../types/types';
import { getCurrentPeriod } from '../time';

const useCurrentPeriod = (
    data: { periods: Period[] } | undefined,
    pollingPeriod?: number,
): [Period | null, Period | null] => {
    const [[currPeriod, nextCurrPeriod], setCurrPeriodInfo] = useState<
        [Period | null, Period | null]
    >([null, null]);

    useEffect(() => {
        if (!data) {
            setCurrPeriodInfo([null, null]);
            return;
        }
        const interval = setInterval(() => {
            const [newCurrPeriod, newNextCurrPeriod] = getCurrentPeriod(
                data.periods,
            );
            setCurrPeriodInfo([newCurrPeriod, newNextCurrPeriod]);
        }, pollingPeriod ?? 10000);

        const [newCurrPeriod, newNextCurrPeriod] = getCurrentPeriod(
            data.periods,
        );
        setCurrPeriodInfo([newCurrPeriod, newNextCurrPeriod]);

        return () => clearInterval(interval);
    }, [data, pollingPeriod]);

    return [currPeriod, nextCurrPeriod];
};

export default useCurrentPeriod;
