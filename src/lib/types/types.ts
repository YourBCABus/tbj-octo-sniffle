export interface Teacher {
    id: string
    name: string
    absenceState: {
        isFullyAbsent: boolean
        absentPeriods: {
            id: string
            name: string,
        }[]
    }
}

export enum AbsenceState {
    ABSENT = "ABSENT",
    ABSENT_ALL_DAY = "ABSENTALLDAY",
    PRESENT = "PRESENT",
    NO_PERIOD = "NO_PERIOD",
}

export interface Period {
    name: string
    id: string
    timeRange: {
        start: number
        end: number
    }
    teachersAbsent: { id: string }[]
}

export interface Setting {
    id: string,
    description: string,
    value: boolean
}

export interface TeacherEntryProps {
    teacher: Teacher
    idx: Number
    setStar: (id: string) => void
    starred: boolean
    absent: AbsenceState
    minimalist: boolean
    hapticfeedback: boolean
}

export interface SettingEntryProps {
    setting: Setting
    setValue: (id: string) => void
}