import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { signOut } from '../google';

const useKickToSignIn = (navigation: NativeStackNavigationProp<any>) =>
    useCallback(async () => {
        await signOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'TableJet - Sign In' }],
        });
    }, [navigation]);

export default useKickToSignIn;
