import AsyncStorage from '@react-native-async-storage/async-storage';
import { Setting } from '../types/types';

export type SettingsCollection = string;
export const SETTINGS_KEY = '@settings';

// Add https://rnfirebase.io/messaging/ios-permissions#handle-button-for-in-app-notifications-settings?
const DEFAULT_SETTINGS: Setting[] = [
    {
        id: 'minimalist',
        description: 'Use Alternate Icons',
        value: false,
    },
    {
        // for later, but make sure if users decline notifications, inform them that they need to go into settings to enable them
        id: 'notifications',
        description: 'Notifications Every Period',
        value: true,
    },
    {
        id: 'hapticfeedback',
        description: 'Use Haptic Feedback',
        value: true,
    },
];

export async function initializeDefaults(): Promise<Setting[]> {
    try {
        const stringifiedSettings = JSON.stringify(DEFAULT_SETTINGS);
        await AsyncStorage.setItem(SETTINGS_KEY, stringifiedSettings);
        // We are guaranteed that the parse is successful since the defaults will always be the same
        return DEFAULT_SETTINGS;
    } catch (e) {
        throw new SettingError(e, true);
    }
}

async function __getSettingString(
    isInitError: boolean,
): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(SETTINGS_KEY);
    } catch (e) {
        throw new SettingError(e, isInitError);
    }
}

export async function validateSettings(): Promise<Boolean> {
    try {
        const currentSettings = [...(await initialSettingsLoad())];
        const defaultSettings = [...DEFAULT_SETTINGS];

        const matchedSettings = currentSettings.filter(setting => {
            return defaultSettings.some(
                defaultSetting => defaultSetting.id === setting.id,
            );
        });

        if (matchedSettings.length !== defaultSettings.length) {
            // if the settings are not the same length, we have a problem
            // basically, if we updated, we are just gonna reset user settings to default for now, not ideal, but if theres a setting mismatch this is easiest for now
            await initializeDefaults();
        } else {
            // if the settings are the same length, we can just set the settings to the matched settings
            // this is because the settings are the same length, so we know that the settings are the same
            await AsyncStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(currentSettings),
            );
        }

        return true;
    } catch (e) {
        return false;
    }
}

export async function initialSettingsLoad(): Promise<Setting[]> {
    const settingsString = await __getSettingString(false);

    // had a weird issue where something deleted the settings key from storage, may have to investigate
    if (settingsString === null || settingsString === '[]') {
        return initializeDefaults();
    } else {
        try {
            return JSON.parse(settingsString).filter(
                (value: unknown) => typeof value === 'object',
            );
        } catch (err) {
            return initializeDefaults();
        }
    }
}

// Function to return the truth value of a given setting
// Defaults to false if no data returned or if setting not found
export async function getSettingState(id: string): Promise<boolean> {
    const settings = await initialSettingsLoad();
    const setting = settings.find(setting => setting.id === id);

    if (setting === undefined) return false;
    return setting.value;
}

export class SettingError extends Error {
    constructor(reason: unknown, public isInitError: boolean = false) {
        super(String(reason));
    }
}

// return is success or failure of update
export async function updateSettingStorage(
    setSettingValue: (settings: Setting[]) => void,
    id: string,
    value?: boolean,
): Promise<boolean> {
    try {
        const settings = await initialSettingsLoad();
        let newsettings: Setting[];
        if (value === undefined) {
            newsettings = settings.map(setting => {
                // TODO: There *has* to be a better way to do this
                setting.id === id
                    ? (setting.value = !setting.value)
                    : (setting.value = setting.value);
                return setting;
            });
        } else if (value === true) {
            newsettings = settings.map(setting => {
                setting.id === id
                    ? (setting.value = true)
                    : (setting.value = setting.value);
                return setting;
            });
        } else {
            newsettings = settings.map(setting => {
                // TODO: There *has* to be a better way to do this
                setting.id === id
                    ? (setting.value = false)
                    : (setting.value = setting.value);
                return setting;
            });
        }

        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newsettings));

        setSettingValue(newsettings);
        return true;
    } catch (e) {
        return false;
    }
}
