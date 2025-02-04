import type { User } from './index';
import {
    expireIdToken,
    expireUserData,
    getUserData,
    setIdToken,
} from '../storage/auth';

export interface SignInState {
    userInfo: User | null;
}

export const signIn = async (
    _onCancelled: () => void,
    _onError: () => void,
): Promise<User | null> => {
    throw new Error('Unimplemented');
};

export const trySilentSignIn = async (
    onError: () => void,
): Promise<User | null> => {
    try {
        return await getUserData();
    } catch (e) {
        console.error(e);
        onError();
        return null;
    }
};

export const configure = () => {};
export const ensurePlayServices = async () => {};

export const updateIdToken = async (userInfo: User): Promise<User> => {
    if (userInfo.idToken) {
        const idToken = userInfo.idToken;
        await setIdToken(idToken);
        return {
            ...userInfo,
            idToken,
        };
    } else {
        await signOut();
        throw new Error('ID Token not found');
    }
};

export const signOut = async () => {
    await expireUserData();
    await expireIdToken();
};
