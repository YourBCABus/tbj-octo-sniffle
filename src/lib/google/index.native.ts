import {
    GoogleSignin,
    User,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { expireIdToken, setIdToken } from '../storage/auth';
import { alert } from '../webcompat/alerts';

export interface SignInState {
    userInfo: User | null;
}

export const signIn = async (
    onCancelled: () => void,
    onError: () => void,
    canBypass: boolean,
): Promise<User | null> => {
    const isErrorWithCode = (error: unknown): error is { code: string } => {
        return typeof error === 'object' && error !== null && 'code' in error;
    };

    configure(!canBypass);
    await ensurePlayServices();

    try {
        const userInfo = await GoogleSignin.signIn();
        const augmented = await updateIdToken(userInfo);
        if (canBypass || augmented.user.email.match(/^.+@bergen\.org$/)) {
            console.info(augmented.user);
            console.debug(augmented);
            return augmented;
        } else {
            alert('Please sign in with an @bergen.org email address');
            await signOut();
            onError();
            return null;
        }
    } catch (error) {
        console.error("Couldn't sign in", error);
        console.error("Couldn't sign in", (error as Error).message);
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
        configure(false);
        await ensurePlayServices();
    } catch (error) {
        console.error("Couldn't configure/set up Google Sign-In", error);
        onError();
        return null;
    }

    try {
        const userInfo = await GoogleSignin.signInSilently();
        const augmented = await updateIdToken(userInfo);
        console.info(augmented.user);
        console.debug(augmented);
        return augmented;
    } catch (error) {
        console.warn("Couldn't sign in silently", error);
        return null;
    }
};

export const configure = (lockToDomain: boolean) => {
    GoogleSignin.configure({
        webClientId:
            '272982920556-82qhftjei4mhs0sm5g91dutu655tkdd0.apps.googleusercontent.com',
        hostedDomain: lockToDomain ? 'bergen.org' : undefined,
        // offlineAccess: true,
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
    await GoogleSignin.signOut();
    await expireIdToken();
};
