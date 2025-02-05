import { Alert, Platform } from 'react-native';

const webAlert = (title: string, message?: string) => {
    // @ts-expect-error
    window.alert(`${title}\n\n${message ?? ''}`.trim());
};

export const alert = (title: string, message?: string) => {
    if (Platform.OS === 'web') {
        webAlert(title, message);
    } else {
        Alert.alert(title, message);
    }
};
