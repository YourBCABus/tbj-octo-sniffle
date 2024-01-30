export interface Teacher {
    id: string;
    displayName: string;
    name: TeacherName;
    pronouns: PronounSet;
    absence: string[]; // will be an array of period ids
    fullyAbsent: boolean;
}

export interface PronounSet {
    sub: string;
    subject: string;
    obj: string;
    object: string;
    posAdj: string;
    possAdjective: string;
    posPro: string;
    possPronoun: string;
    refx: string;
    reflexive: string;
    grammPlu: boolean;
    grammaticallyPlural: boolean;
    setStr: string;
}

export interface TeacherName {
    honorific: string;
    first: string;
    middles: string[];
    last: string;
    // formatted: string
    full: string;
    firstLast: string;
    normal: string;
}

export enum AbsenceState {
    ABSENT_PART_PRESENT = 'ABSENT_PART_PRESENT',
    ABSENT_PART_ABSENT = 'ABSENT_PART_ABSENT',
    ABSENT_PART_UNSURE = 'ABSENT_PART_UNSURE',
    ABSENT_ALL_DAY = 'ABSENTALLDAY',
    PRESENT = 'PRESENT',
    DAY_OVER = 'DAY_OVER',
}

export interface Period {
    id: string;
    name: string;
    defaultTimeRange: TimeRange;
    timeRange: TimeRange;
    teachersAbsent: Teacher[];
}

export interface TimeRange {
    start: number;
    end: number;
}

export interface Setting {
    id: string;
    description: string;
    value: boolean;
}

export interface TeacherEntryProps {
    teacher: Teacher;
    idx: Number;
    setStar: (id: string) => void;
    starred: boolean;
    absent: AbsenceState;
    minimalist: boolean;
    hapticfeedback: boolean;

    periods: Period[];
}

export interface SettingEntryProps {
    setting: Setting;
    setValue: (id: string) => void;
}
