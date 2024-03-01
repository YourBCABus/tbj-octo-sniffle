import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClientKey {
    id: string;
    secret: string;
}

export async function getClientKey(): Promise<ClientKey | null> {
    try {
        const key = await AsyncStorage.getItem('@auth');
        if (!key) return null;

        const parsed = JSON.parse(key);
        if (typeof parsed !== 'object' || parsed === null) return null;

        const { id, secret } = parsed;
        if (typeof id !== 'string' || typeof secret !== 'string') return null;

        return { id, secret };
    } catch (e) {
        console.warn(e);
    }
    return null;
}

export async function setClientKey(id: string, secret: string): Promise<void> {
    try {
        await AsyncStorage.setItem('@auth', JSON.stringify({ id, secret }));
    } catch (e) {
        console.warn(e);
    }
}
