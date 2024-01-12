import { useMemo } from 'react';
import { Period } from '../types/types';
import { getCurrentPeriod } from '../time';

const useCurrentPeriod = (
    data: { periods: Period[] } | undefined,
): Period | null => {
    return useMemo(
        () => (data ? getCurrentPeriod(data.periods) : null),
        [data],
    );
};

export default useCurrentPeriod;
