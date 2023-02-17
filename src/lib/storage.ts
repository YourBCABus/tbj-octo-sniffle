import AsyncStorage from '@react-native-async-storage/async-storage'

export type StarredIds = Set<string>;

export const STARRED_ID_KEY = "@starred_teacher_ids";

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

export async function initialLoad(): Promise<StarredIds> {
    const jsonIds = await __getItem(false);

    if (jsonIds === null) {
        return initializeBlank();
    } else {
        try {
            return new Set(JSON.parse(jsonIds).filter((value: unknown) => typeof value === 'string'));
        } catch (err) {
            return initializeBlank();
        }
    }
};

export class StarError extends Error {
    constructor(reason: unknown, public isInitError: boolean = false) {
        super(String(reason));
    }
}

// TODO - add a way to alert users that update failed.
// Return is whether or not the update was successful.
export async function update(setTeacherIds: (ids: StarredIds) => void, id: string, value?: boolean): Promise<boolean> {
    console.log({ id, value });
    try {
        let old = await initialLoad();

        if (value === undefined) {
            old.has(id) ? old.delete(id) : old.add(id);
        } else if (value) {
            old.add(id);
        } else {
            old.delete(id);
        }

        await AsyncStorage.setItem(STARRED_ID_KEY, JSON.stringify([...old]));

        setTeacherIds(old);
        return true;
    } catch (e) {
        return false;
    }
};
