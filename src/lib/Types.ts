export interface Teacher {
    id: string
    name: string
}

export interface TeacherEntryProps {
    teacher: Teacher
    idx: Number
    setStar: (id: string) => void
    starred: boolean
}