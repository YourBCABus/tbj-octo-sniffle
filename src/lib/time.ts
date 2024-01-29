import { Period } from './types/types';

export function getSecondsSinceUtcMidnight(d: Date) {
    let secHours = d.getUTCHours() * 3600;
    let secMinutes = d.getUTCMinutes() * 60;
    let secSeconds = d.getUTCSeconds();

    return secHours + secMinutes + secSeconds;
}

export function getSecondsSinceUtcMidnightNow() {
    return getSecondsSinceUtcMidnight(new Date());
}

export function getCurrentPeriod(
    periods: Period[] | null,
): [Period | null, Period | null] {
    const currTime = getSecondsSinceUtcMidnightNow();
    // const cur_time = getSecondsSinceUtcMidnight(new Date(2021, 3, 20, 15, 5, 0))
    if (periods === null || periods === undefined) {
        return [null, null];
    }

    const currPeriod = periods.filter(period => {
        const afterStart = period.timeRange.start <= currTime;
        const beforeEnd = period.timeRange.end >= currTime;
        return afterStart && beforeEnd;
    })[0];
    const nextCurrPeriods = [...periods]
        .sort((a, b) => a.timeRange.start - b.timeRange.start) // Sort ascending
        .filter(period => currTime <= period.timeRange.end); // Get all not-yet-finished periods
    const nextCurrPeriod = nextCurrPeriods[0] ?? null; // Get the earliest not-yet-finished period

    if (currPeriod === undefined) {
        console.log('No period found');
        return [null, nextCurrPeriod];
    }

    return [currPeriod, nextCurrPeriod];
}
