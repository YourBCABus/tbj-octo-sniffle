import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getSettingState } from '../storage/SettingStorage';

const useSetting = (settingName: string, defaultValue: boolean) => {
    const [settingValue, setSettingValue] = useState(defaultValue);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const reqSettingState = async () => {
                try {
                    const state = await getSettingState(settingName);

                    if (isActive) {
                        setSettingValue(state);
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            reqSettingState();

            return () => {
                isActive = false;
            };
        }, [setSettingValue, settingName]),
    );

    return settingValue;
};

export default useSetting;
