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

interface PeriodRange {
    type: 'group';
    start: Period;
    end: Period;
}
interface SinglePeriod {
    type: 'single';
    period: Period;
}
export type PeriodGroup = PeriodRange | SinglePeriod;

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
    return name.replace(/^\s*([Pp]eriod)\s+/, '');
};

export type HexColor = `#${string}`;
export type RgbaColor = { r: number; g: number; b: number; a?: number };
export type ColorInput = HexColor | RgbaColor;

export const hexRgbToRgba = (hex: HexColor): RgbaColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
};

export const hexRgbaToRgba = (hex: HexColor): RgbaColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;

    return { r, g, b, a };
};

export const colorToRgba = (color: ColorInput): RgbaColor => {
    if (typeof color === 'string') {
        if (color.length === 7) {
            return hexRgbToRgba(color);
        } else {
            return hexRgbaToRgba(color);
        }
    } else {
        return color;
    }
};

export const rgbaToString = (rgba: RgbaColor): string => {
    const { r, g, b, a = 1 } = rgba;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const colorToString = (color: ColorInput): string => {
    return rgbaToString(colorToRgba(color));
};
