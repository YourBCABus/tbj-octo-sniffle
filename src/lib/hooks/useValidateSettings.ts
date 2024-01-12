import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { validateSettings } from '../storage/SettingStorage';

const useValidateSettings = () => {
    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const validate = async () => {
                try {
                    if (isActive) {
                        validateSettings();
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            validate();

            return () => {
                isActive = false;
            };
        }, []),
    );
};

export default useValidateSettings;
