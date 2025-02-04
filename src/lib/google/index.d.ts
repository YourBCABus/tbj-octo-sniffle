// import type { User } from '@react-native-google-signin/google-signin';
export interface User {
    user: {
        id: string;
        name: string | null;
        email: string;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
    };
    scopes?: string[];
    idToken: string | null;
    /**
     * Not null only if a valid webClientId and offlineAccess: true was
     * specified in configure().
     */
    serverAuthCode: string | null;
}

export interface SignInState {
    userInfo: User | null;
}

export declare const signIn: (
    onCancelled: () => void,
    onError: () => void,
    allowDomainRestrictionsBypass: boolean,
) => Promise<User | null>;
export const trySilentSignIn: (onError: () => void) => Promise<User | null>;
export const configure: () => void;
export const ensurePlayServices: () => Promise<void>;
export const updateIdToken: (userInfo: User) => Promise<User>;
export const signOut: () => Promise<void>;
