import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    initialIdLoad,
    updateTeacherStarStorage,
    updateTeacherStarOrder,
    validateIDs,
} from '../storage/StarredTeacherStorage';
import { Teacher } from '../types/types';
import { ReorderableListReorderEvent } from '../../components/reordering/util';
import { reorderItems } from '../../components/reordering/util';
// import {
//     ReorderableListReorderEvent,
//     reorderItems,
// } from 'react-native-reorderable-list';

export type ToggleTeacher = (id: string) => void;
export type ReorderTeachers = (event: ReorderableListReorderEvent) => void;

export const useStarredTeacherIds = (
    data: { teachers: Teacher[] } | undefined,
): [string[], ToggleTeacher, ReorderTeachers] => {
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
    const reorderTeacherStarState = useCallback(
        ({ from, to }: ReorderableListReorderEvent) => {
            const newOrder = reorderItems(starredTeachers, from, to);
            updateTeacherStarOrder(newOrder).then(() =>
                setStarredTeachers(newOrder),
            );
        },
        [starredTeachers, setStarredTeachers],
    );

    return [starredTeachers, toggleTeacherStarState, reorderTeacherStarState];
};

export const useStarredTeachers = (teachers: Teacher[], stars: string[]) => {
    const lut = Object.fromEntries(
        teachers.map(teacher => [teacher.id, teacher]),
    );
    return useMemo(() => stars.map(id => lut[id]), [lut, stars]);
};
