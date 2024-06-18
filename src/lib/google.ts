import {
    GoogleSignin,
    User,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {
    expireServerAuthCode,
    getServerAuthCode,
    setServerAuthCode,
} from './storage/auth';

export interface SignInState {
    userInfo: User | null;
}

export const signIn = async (
    onCancelled: () => void,
    onError: () => void,
): Promise<User | null> => {
    const isErrorWithCode = (error: unknown): error is { code: string } => {
        return typeof error === 'object' && error !== null && 'code' in error;
    };

    configure();
    await ensurePlayServices();

    try {
        const userInfo = await GoogleSignin.signIn();
        const augmented = await augmentWithServerAuthCode(userInfo);
        console.info(augmented.user);
        console.debug(augmented);
        return augmented;
    } catch (error) {
        console.error("Couldn't sign in", error);
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    return null;
                case statusCodes.SIGN_IN_CANCELLED:
                    onCancelled();
                    return null;
            }
        }
        onError();
        return null;
    }
};

export const trySilentSignIn = async (
    onError: () => void,
): Promise<User | null> => {
    try {
        configure();
        await ensurePlayServices();
    } catch (error) {
        console.error("Couldn't configure/set up Google Sign-In", error);
        onError();
        return null;
    }

    try {
        const userInfo = await GoogleSignin.signInSilently();
        const augmented = await augmentWithServerAuthCode(userInfo);
        console.info(augmented.user);
        console.debug(augmented);
        return augmented;
    } catch (error) {
        console.warn("Couldn't sign in silently", error);
        return null;
    }
};

export const configure = () => {
    GoogleSignin.configure({
        webClientId:
            '272982920556-82qhftjei4mhs0sm5g91dutu655tkdd0.apps.googleusercontent.com',
        offlineAccess: true,
    });
};

export const ensurePlayServices = async () => {
    const hasServices = await GoogleSignin.hasPlayServices();
    if (!hasServices) {
        console.warn(
            'Google Play Services are NOT available, check configuration',
        );
        throw new Error('Google Play Services are not available');
    }
    console.info('Google Play Services are available');
};

export const augmentWithServerAuthCode = async (
    userInfo: User,
): Promise<User & { serverAuthCode: {} }> => {
    if (userInfo.serverAuthCode) {
        const serverAuthCode = userInfo.serverAuthCode;
        await setServerAuthCode(serverAuthCode);
        return {
            ...userInfo,
            serverAuthCode,
        };
    } else {
        const cachedServerAuthCode = await getServerAuthCode();
        if (!cachedServerAuthCode?.serverAuthCode) {
            await GoogleSignin.signOut();
            throw new Error('Server Auth Code not found');
        }

        return {
            ...userInfo,
            serverAuthCode: cachedServerAuthCode.serverAuthCode,
        };
    }
};

export const signOut = async () => {
    await GoogleSignin.signOut();
    await expireServerAuthCode();
};
