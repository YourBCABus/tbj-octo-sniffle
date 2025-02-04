import { useContext, useEffect } from 'react';

import { IdTokenContext } from '../../../App';
import type { User } from '@react-native-google-signin/google-signin';
import { trySilentSignIn } from '../google';
import { idTokenToUser } from '../google/util';

const useTrySilentSignIn = (
    onSignedIn: (u: User) => void,
    onSignedOut: () => void,
    onError: (e: unknown) => void,
) => {
    const [idToken] = useContext(IdTokenContext);
    useEffect(() => {
        (async () => {
            try {
                if (!idToken) {
                    const silentSignInUser = await trySilentSignIn(() =>
                        onError(new Error('Silent Sign In')),
                    );

                    if (silentSignInUser) {
                        onSignedIn(silentSignInUser);
                    } else {
                        onSignedOut();
                    }
                } else {
                    onSignedIn(idTokenToUser(idToken));
                }
            } catch (e) {
                onError(e);
            }
        })();
    }, [idToken, onError, onSignedIn, onSignedOut]);
};

export default useTrySilentSignIn;
