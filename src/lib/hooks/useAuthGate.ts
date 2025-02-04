import { useCallback } from 'react';

import useKickToSignIn from './useKickToSignIn';
import useTrySilentSignIn from './useTrySilentSignIn';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from '../google';

const voidFn = () => {};
const useAuthGate = (navigation: NativeStackNavigationProp<any>) => {
    const kick = useKickToSignIn(navigation);
    const onError = useCallback(() => {
        signOut().then(() => navigation.replace('TableJet - Error'));
    }, [navigation]);
    useTrySilentSignIn(voidFn, kick, onError);
};

export default useAuthGate;
