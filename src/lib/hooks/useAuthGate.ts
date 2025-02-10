import { useCallback, useContext } from 'react';

import useKickToSignIn from './useKickToSignIn';
import useTrySilentSignIn from './useTrySilentSignIn';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut, User } from '../google';
import { IdTokenContext } from '../../../App';

const useAuthGate = (navigation: NativeStackNavigationProp<any>) => {
    const kick = useKickToSignIn(navigation);
    const onError = useCallback(() => {
        signOut().then(() => navigation.replace('TableJet - Error'));
    }, [navigation]);
    const [, setIdToken] = useContext(IdTokenContext);
    const onSignedIn = useCallback(
        (user: User) => {
            if (user.idToken) {
                setIdToken(user.idToken);
            } else {
                kick();
            }
        },
        [setIdToken, kick],
    );
    useTrySilentSignIn(onSignedIn, kick, onError);
};

export default useAuthGate;
