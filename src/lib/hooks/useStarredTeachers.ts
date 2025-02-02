import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    initialIdLoad,
    updateTeacherStarStorage,
    validateIDs,
} from '../storage/StarredTeacherStorage';
import { Teacher } from '../types/types';

export const useStarredTeacherIds = (
    data: { teachers: Teacher[] } | undefined,
): [string[], (id: string) => void] => {
    const [starredTeachers, setStarredTeachers] = useState<string[]>([]);

    useEffect(() => {
        if (data !== undefined) {
            validateIDs(setStarredTeachers, data.teachers);
        }
    }, [data]);

    useEffect(() => {
        initialIdLoad().then(value => setStarredTeachers(value));
    }, []);

    const toggleTeacherStarState = useCallback(
        (id: string) => updateTeacherStarStorage(setStarredTeachers, id),
        [setStarredTeachers],
    );

    return [starredTeachers, toggleTeacherStarState];
};

export const useStarredTeachers = (teachers: Teacher[], stars: string[]) => {
    const lut = Object.fromEntries(
        teachers.map(teacher => [teacher.id, teacher]),
    );
    return useMemo(() => stars.map(id => lut[id]), [lut, stars]);
};
