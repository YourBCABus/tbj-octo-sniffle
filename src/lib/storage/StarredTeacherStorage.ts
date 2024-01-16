import AsyncStorage from '@react-native-async-storage/async-storage';
import { Teacher } from '../types/types';
import {
    subscribeToNotification,
    unsubscribeToNotification,
} from '../notifications/Notification';

export type StarredIds = Set<string>;

export const STARRED_ID_KEY = '@starred_teacher_ids';

export async function initializeBlank(): Promise<StarredIds> {
    try {
        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify([]));
        return new Set();
    } catch (e) {
        throw new StarError(e, true);
    }
}

async function __getItem(isInitError: boolean): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(STARRED_ID_KEY);
    } catch (e) {
        throw new StarError(e, isInitError);
    }
}

export async function validateIDs(
    setTeacherIds: (ids: StarredIds) => void,
    teachers: Teacher[],
): Promise<boolean> {
    try {
        const currentIds = [...(await initialIdLoad())];
        const filteredIDs = currentIds.filter(id => teachers.some(teacher => teacher.id === id));

        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify(filteredIDs));
        setTeacherIds(new Set(filteredIDs));
        return true;
    } catch (e) {
        return false;
    }
}

export async function initialIdLoad(): Promise<StarredIds> {
    const jsonIds = await __getItem(false);

    if (jsonIds === null) {
        return initializeBlank();
    } else {
        try {
            return new Set(
                JSON.parse(jsonIds).filter(
                    (value: unknown) => typeof value === 'string',
                ),
            );
        } catch (err) {
            return initializeBlank();
        }
    }
}

export class StarError extends Error {
    constructor(reason: unknown, public isInitError: boolean = false) {
        super(String(reason));
    }
}

// TODO - add a way to alert users that update failed.
// Return is whether or not the update was successful.
export async function updateTeacherStarStorage(
    setTeacherIds: (ids: StarredIds) => void,
    id: string,
    value?: boolean,
): Promise<boolean> {
    try {
        let old = await initialIdLoad();

        if (value === undefined) {
            // old.has(id) ? old.delete(id) : old.add(id);
            if (old.has(id)) {
                unsubscribeToNotification(id);
                old.delete(id);
            } else {
                subscribeToNotification(id);
                old.add(id);
            }
        } else if (value) {
            subscribeToNotification(id);
            old.add(id);
        } else {
            unsubscribeToNotification(id);
            old.delete(id);
        }

        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify([...old]));

        setTeacherIds(old);
        return true;
    } catch (e) {
        return false;
    }
}
