import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../google';
import { decode } from 'base-64';

interface IdToken {
    idToken: string;
}

const KEY = '@id_token';
const USER_KEY = '@user_data';

export async function getIdToken(): Promise<IdToken | null> {
    try {
        const idToken = await AsyncStorage.getItem(KEY);
        if (!idToken) {
            return null;
        }
        const [, data] = idToken.split('.');
        const json = decode(data);
        const exp = JSON.parse(json).exp;
        if (exp < Date.now() / 1000) {
            return { idToken };
        } else {
            expireIdToken();
            return null;
        }
    } catch (e) {
        console.warn(e);
    }
    return null;
}
export async function getUserData(): Promise<User | null> {
    try {
        const user = await AsyncStorage.getItem(USER_KEY);
        if (!user) {
            return null;
        }
        const userParsed = JSON.parse(user);
        const [, data] = userParsed.idToken.split('.');
        const json = decode(data);
        const exp = JSON.parse(json).exp;
        if (Date.now() / 1000 < exp) {
            return userParsed;
        } else {
            expireUserData();
            return null;
        }
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
export async function setUserData(user: User): Promise<void> {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
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
export async function expireUserData(): Promise<void> {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
        console.warn(e);
    }
}
