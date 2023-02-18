import { Period } from "./types";

export function getSecondsSinceUtcMidnight(d: Date) {
    let secHours = d.getUTCHours() * 3600;
    let secMinutes = d.getUTCMinutes() * 60;
    let secSeconds = d.getUTCSeconds();

    return secHours + secMinutes + secSeconds;
}

export function getSecondsSinceUtcMidnightNow() {
    return getSecondsSinceUtcMidnight(new Date());
}

export function getCurrentPeriod(periods: Period[] | null): Period | null {
    const cur_time = getSecondsSinceUtcMidnightNow();
    // const cur_time = getSecondsSinceUtcMidnight(new Date(2021, 3, 20, 15, 5, 0))
    console.log(cur_time)
    if(periods === null || periods === undefined) {
        return null;
    }

    let curperiod = periods.filter((period: Period) => {
        return period.timeRange.start <= cur_time && period.timeRange.end >= cur_time
    })[0];
        
    if(curperiod === undefined) {
        console.log("No period found");
        return null;
    }

    return curperiod;
}