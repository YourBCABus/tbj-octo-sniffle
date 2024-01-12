import { Period } from './types/types';

export type Camelize<T extends string> = T extends `${infer F}_${infer R}`
    ? `${F}${Capitalize<Camelize<R>>}`
    : T extends `${infer F}-${infer R}`
    ? `${F}${Capitalize<Camelize<R>>}`
    : T;

export const camelize = <T extends string>(input: T): Camelize<T> => {
    const parts = input.split('_').flatMap(part => part.split('-'));

    const capitalizedParts = [
        parts[0],
        ...parts.slice(1).map(part => part[0].toUpperCase() + part.slice(1)),
    ];

    return capitalizedParts.join('') as Camelize<T>;
};

export type PeriodGroup = {
    type: 'group';
    start: Period;
    end: Period;
} | {
    type: "single";
    period: Period;
};

export const getPeriodRanges = (
    periods: [Period, boolean][],
): PeriodGroup[] => {
    const groups: PeriodGroup[] = [];
    let currentGroup: PeriodGroup | null = null;
    for (const [period, isAbsent] of periods) {
        if (isAbsent) {
            if (currentGroup === null) {
                currentGroup = { type: 'single', period };
            } else if (currentGroup.type === 'single') {
                currentGroup = {
                    type: 'group',
                    start: currentGroup.period,
                    end: period,
                };
            } else {
                currentGroup.end = period;
            }
        } else {
            if (currentGroup !== null) {
                groups.push(currentGroup);
                currentGroup = null;
            }
        }
    }
    if (currentGroup !== null) {
        groups.push(currentGroup);
    }

    return groups;
};

export const getPeriodRangeString = (periodGroup: PeriodGroup): string => {
    if (periodGroup.type === 'single') {
        return trimPeriodName(periodGroup.period.name);
    } else {
        const start = trimPeriodName(periodGroup.start.name);
        const end = trimPeriodName(periodGroup.end.name);
        return `${start}-${end}`;
    }
};

export const formatPeriodRanges = (periods: [Period, boolean][]): string => {
    const groups = getPeriodRanges(periods);
    if (groups.length === 0) {
        return 'None';
    } else if (groups.length === 1) {
        return getPeriodRangeString(groups[0]);
    } else if (groups.length === 2) {
        return groups.map(getPeriodRangeString).join(' and ');
    } else {
        const last = groups.pop()!;
        const strings = groups.map(getPeriodRangeString);
        return `${strings.join(', ')}, and ${getPeriodRangeString(last)}`;
    }
};

export const trimPeriodName = (name: string): string => {
    return name.replace(/^\s+(Period)\s+/, '');
};
