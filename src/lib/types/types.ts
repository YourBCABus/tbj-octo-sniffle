export interface Teacher {
    id: string;
    displayName: string;
    name: TeacherName;
    absence: string[]; // will be an array of period ids
    comments?: string | null;
    fullyAbsent: boolean;
}

export interface TeacherName {
    honorific: string;
    last: string;
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
    timeRange: TimeRange;
    teachersAbsent: { id: string }[];
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
    toggleStar: (id: string) => void;
    starred: boolean;
    absent: AbsenceState;
    minimalist: boolean;
    hapticfeedback: boolean;

    periods: Period[];

    disableInteraction?: boolean;
}

export interface SettingEntryProps {
    setting: Setting;
    setValue: (id: string) => void;
}
