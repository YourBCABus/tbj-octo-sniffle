import { useMemo } from 'react';
import { Teacher, UnprocessedTeacher } from '../types/types';

const useTeachers = (
    data: { teachers: UnprocessedTeacher[] } | undefined,
): Teacher[] => {
    return useMemo(() => {
        if (!data) {
            return [];
        }
        return data.teachers.map(teacher => {
            return {
                id: teacher.id,
                displayName: teacher.name.normal,
                name: {
                    honorific: teacher.name.honorific,
                    last: teacher.name.last,
                    normal: teacher.name.normal,
                },
                absence:
                    teacher.absence.map(absenceResult => absenceResult.id) ??
                    [],
                fullyAbsent: teacher.fullyAbsent,
                comments: teacher.comments,
            };
        });
    }, [data]);
};

export default useTeachers;
