import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    SettingError,
    handleSettingsError,
    validateSettings,
} from '../storage/SettingStorage';

const useFixSettings = () => {
    useFocusEffect(
        useCallback(() => {
            const continueValidating = new AbortController();
            const continueValidatingSignal = continueValidating.signal;

            const validate = async () => {
                try {
                    if (!continueValidatingSignal.aborted) {
                        validateSettings().catch((e: unknown) => {
                            if (e instanceof SettingError) {
                                handleSettingsError(e);
                            } else {
                                console.warn(
                                    `Unknown setting validation error: ${e}`,
                                );
                            }
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            validate();

            return () => continueValidating.abort();
        }, []),
    );
};

export default useFixSettings;
