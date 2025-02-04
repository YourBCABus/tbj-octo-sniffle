import AsyncStorage from '@react-native-async-storage/async-storage';
import { Teacher } from '../types/types';
import {
    hasNotifPermission,
    subscribeToNotification,
    unsubscribeToNotification,
} from '../notifications/Notification';

export type StarredIds = string[];

export const STARRED_ID_KEY = '@starred_teacher_ids';

export async function initializeBlank(): Promise<StarredIds> {
    try {
        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify([]));
        return [];
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
    setStarredIds: (ids: StarredIds) => void,
    teachers: Teacher[],
): Promise<boolean> {
    try {
        const currentIds = await initialIdLoad();
        const filteredIDs = currentIds.filter(id =>
            teachers.some(teacher => teacher.id === id),
        );

        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify(filteredIDs));
        setStarredIds(filteredIDs);
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
            return JSON.parse(jsonIds).filter(
                (value: unknown) => typeof value === 'string',
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
        let willAdd = value || !old.includes(id);

        if (await hasNotifPermission()) {
            if (willAdd) {
                subscribeToNotification(id);
            } else {
                unsubscribeToNotification(id);
            }
        }

        const newStarred = willAdd
            ? [...old, id]
            : old.filter(cid => cid !== id);

        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify(newStarred));

        setTeacherIds(newStarred);
        return true;
    } catch (e) {
        return false;
    }
}

export async function updateTeacherStarOrder(newOrder: string[]) {
    await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify(newOrder));
}
