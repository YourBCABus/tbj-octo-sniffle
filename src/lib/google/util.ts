import type { User } from '@react-native-google-signin/google-signin';

export const idTokenToUser = (token: string): User => {
    const [, body] = token.split('.');
    // @ts-expect-error
    const json = window.atob(body);
    const userData = JSON.parse(json);
    return {
        user: {
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            photo: userData.picture,
            familyName: userData.family_name,
            givenName: userData.given_name,
        },
        idToken: token,
        scopes: [],
        serverAuthCode: null,
    };
};
