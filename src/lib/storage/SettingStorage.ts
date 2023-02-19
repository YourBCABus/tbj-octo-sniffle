import AsyncStorage from '@react-native-async-storage/async-storage'
import { Setting } from '../types';

export type SettingsCollection = string;
export const SETTINGS_KEY = "@settings";

const DEFAULT_SETTINGS : Setting[] = [
    {
        id: '0',
        description: 'Use Minimalist Icons',
        value: false,
    },
    {
        id: '1',
        description: 'Notifications Every Period',
        value: true,
    },
    {
        id: '2',
        description: 'Use Dark Mode',
        value: true,
    },
]


export async function initializeDefaults(): Promise<Setting[]> {
    try {
        const stringifiedSettings = JSON.stringify(DEFAULT_SETTINGS);
        await AsyncStorage.setItem(SETTINGS_KEY, stringifiedSettings);
        // we are guaranteed that the parse is successful since the defaults will always be the same
        return DEFAULT_SETTINGS;
    } catch(e) {
        throw new SettingError(e, true);
    }
}

async function __getSettingString(isInitError: boolean): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(SETTINGS_KEY);
    } catch (e) {
        throw new SettingError(e, isInitError);
    }
}

export async function validateSettings(setSettingValue: (settings: Setting[]) => void, settings: Setting[]): Promise<Boolean> {
    try {
        const currentSettings = [...await initialSettingsLoad()];
        const filteredSettings = currentSettings.filter(setting => settings.some(setting => setting.id === setting.id));

        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(filteredSettings));
        setSettingValue(filteredSettings);
        return true;
    } catch (e) {
        return false;
    }
}

export async function initialSettingsLoad(): Promise<Setting[]> {
    const settingsString = await __getSettingString(false);

    if(settingsString === null) {
        return initializeDefaults();
    } else {
        try {
            return JSON.parse(settingsString).filter((value: unknown) => typeof value === 'object');
        } catch (err) {
            return initializeDefaults();
        }
    }
}


export class SettingError extends Error {
    constructor(reason: unknown, public isInitError: boolean = false) {
        super(String(reason));
    }
}

// return is success or failure of update
export async function updateSettingStorage(setSettingValue: (settings: Setting[]) => void, id: string, value?: boolean): Promise<boolean> {
    try {
        const settings = await initialSettingsLoad();
        let newsettings: Setting[];
        if(value === undefined) {
            newsettings = settings.map((setting) => {
                setting.id === id ? setting.value = !setting.value : setting.value = setting.value;
                return setting;
            })
        } else if (value === true) {
            newsettings = settings.map((setting) => {
                setting.id === id ? setting.value = true : setting.value = setting.value;
                return setting;
            })
        } else {
            newsettings = settings.map((setting) => {
                setting.id === id ? setting.value = false : setting.value = setting.value;
                return setting;
            })
        }
        
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newsettings));

        setSettingValue(newsettings);
        return true;
    } catch (e) {
        return false;
    }
}