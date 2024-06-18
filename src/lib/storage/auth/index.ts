import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthCode {
    serverAuthCode: string | null;
}

const KEY = '@server_auth_code';

export async function getServerAuthCode(): Promise<AuthCode | null> {
    try {
        const serverAuthCode = await AsyncStorage.getItem(KEY);
        if (!serverAuthCode) {
            return null;
        }
        return { serverAuthCode };
    } catch (e) {
        console.warn(e);
    }
    return null;
}

export async function setServerAuthCode(serverAuthCode: string): Promise<void> {
    try {
        await AsyncStorage.setItem(KEY, serverAuthCode);
    } catch (e) {
        console.warn(e);
    }
}

export async function expireServerAuthCode(): Promise<void> {
    try {
        await AsyncStorage.removeItem(KEY);
    } catch (e) {
        console.warn(e);
    }
}
