import type { User } from '@react-native-google-signin/google-signin';
import type { FC } from 'react';

export interface ButtonProps {
    inProgress: boolean;
    setInProgress: (v: boolean) => void;

    onSuccess: (user: User) => void;
    onSuccessNull: () => void;

    onCancel: () => void;
    onError: () => void;
}

declare const Button: FC<ButtonProps>;

export default Button;
