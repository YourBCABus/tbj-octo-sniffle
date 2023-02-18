export interface Teacher {
    id: string
    name: string
    absenceState: {
        absentPeriods: {
            id: string
            name: string,
        }[]
    }
}

export interface TeacherEntryProps {
    teacher: Teacher
    idx: Number
    setStar: (id: string) => void
    starred: boolean
    absent: AbsenceState
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

export enum AbsenceState {
    ABSENT = "ABSENT",
    PRESENT = "PRESENT",
    NO_PERIOD = "NO_PERIOD",
}