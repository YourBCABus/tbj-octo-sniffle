import AsyncStorage from '@react-native-async-storage/async-storage';

interface IdToken {
    idToken: string | null;
}

const KEY = '@id_token';

export async function getIdToken(): Promise<IdToken | null> {
    try {
        const idToken = await AsyncStorage.getItem(KEY);
        if (!idToken) {
            return null;
        }
        return { idToken };
    } catch (e) {
        console.warn(e);
    }
    return null;
}

export async function setIdToken(idToken: string): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, idToken);
    } catch (e) {
        console.warn(e);
    }
}

export async function expireIdToken(): Promise<void> {
    try {
        await AsyncStorage.removeItem(KEY);
    } catch (e) {
        console.warn(e);
    }
}
