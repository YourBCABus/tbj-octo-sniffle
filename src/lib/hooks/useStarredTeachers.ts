import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    initialIdLoad,
    updateTeacherStarStorage,
    validateIDs,
} from '../storage/StarredTeacherStorage';
import { Teacher } from '../types/types';

export const useStarredTeacherIds = (
    data: { teachers: Teacher[] } | undefined,
): [Set<string>, (id: string) => void] => {
    const [starredTeachers, setStarredTeachers] = useState(new Set<string>());

    useEffect(() => {
        if (data !== undefined) {
            validateIDs(setStarredTeachers, data.teachers);
        }
    }, [data]);

    useEffect(() => {
        initialIdLoad().then(value => setStarredTeachers(value));
    }, [setStarredTeachers]);

    const toggleTeacherStarState = useCallback(
        (id: string) => {
            console.log("ooooooooh!");
            updateTeacherStarStorage(setStarredTeachers, id)
        },
        [setStarredTeachers],
    );

    return [starredTeachers, toggleTeacherStarState];
};

export const useStarredTeachers = (teachers: Teacher[], stars: Set<string>) => {
    return useMemo(
        () => teachers.filter(teacher => stars.has(teacher.id)),
        [teachers, stars],
    );
};
