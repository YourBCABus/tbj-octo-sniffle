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
    {
        id: 'setup',
        description: 'Setup Complete',
        value: false,
    },
];

export async function handleSettingsError(e: SettingError): Promise<Setting[]> {
    console.warn(e.message);

    if (e.needsFullReinit) {
        return e.getNewValue();
    } else {
        try {
            const old = await initialSettingsLoad();
            return e.getNewValue(old);
        } catch (err) {
            console.warn(err);
            return e.getNewValue();
        }
    }
}

export async function initializeDefaults(): Promise<Setting[]> {
    console.trace('Initializing default settings...');
    try {
        const stringifiedSettings = JSON.stringify(DEFAULT_SETTINGS);
        await AsyncStorage.setItem(SETTINGS_KEY, stringifiedSettings);
        // We are guaranteed that the parse is successful since the defaults will always be the same
        return DEFAULT_SETTINGS;
    } catch (e) {
        throw new SettingsUpdateError(e);
    }
}

async function __getSettingString(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(SETTINGS_KEY);
    } catch (e) {
        throw new SettingsKeyMissingError(e);
    }
}
async function __setSettingString(newString: string): Promise<void> {
    try {
        return await AsyncStorage.setItem(SETTINGS_KEY, newString);
    } catch (e) {
        throw new SettingsUpdateError(e);
    }
}

export async function validateSettings(): Promise<void> {
    const currentSettings = [...(await initialSettingsLoad())];
    const defaultSettings = [...DEFAULT_SETTINGS];

    const missingSettings = defaultSettings.filter(setting => {
        return !currentSettings.some(
            currentSetting => currentSetting.id === setting.id,
        );
    });

    if (missingSettings.length > 0) {
        throw new SettingMissingError(missingSettings);
    }

    console.warn('Extra settings found.');
}

async function getSettings(): Promise<Setting[]> {
    const settingsString = await __getSettingString();

    if (settingsString === null || settingsString === '[]') {
        throw new SettingsKeyMissingError('Key lookup returned null');
    }

    try {
        return JSON.parse(settingsString);
    } catch (e) {
        throw new SettingCorruptedError(e);
    }
}

export async function initialSettingsLoad(): Promise<Setting[]> {
    try {
        return await getSettings();
    } catch (e) {
        if (e instanceof SettingsKeyMissingError) {
            console.info('Settings not found, initializing defaults...');
            return initializeDefaults();
        }

        throw e;
    }
}

// Function to return the truth value of a given setting
// Defaults to false if no data returned or if setting not found
export async function getSingleSetting(id: string): Promise<boolean> {
    const settings = await getSettings();
    const setting = settings.find(settingObj => settingObj.id === id);

    if (setting) {
        return setting.value;
    } else {
        const missingDefaultSetting = DEFAULT_SETTINGS.find(
            settingObj => settingObj.id === id,
        );
        const missingSetting = missingDefaultSetting ?? {
            id,
            description: 'Unknown Setting',
            value: false,
        };
        throw new SettingMissingError([missingSetting]);
    }
}

// return is success or failure of update
export async function updateSettingStorage(
    settingValueCallback: (settings: Setting[]) => void,
    id: string,
    value?: boolean,
): Promise<boolean> {
    try {
        const settings = await getSettings();

        const originalSettingValue = settings.find(
            setting => setting.id === id,
        )?.value;

        const newSettingValue = value ?? !originalSettingValue;

        const newSettings = settings.map(setting => {
            const newSetting = { ...setting };
            if (newSetting.id === id) {
                newSetting.value = newSettingValue;
            }
            return newSetting;
        });

        await __setSettingString(JSON.stringify(newSettings));
        settingValueCallback(newSettings);
        return true;
    } catch (e) {
        return false;
    }
}

export abstract class SettingError extends Error {
    constructor(reason: string) {
        super(`Settings error: ${reason}`);
    }
    abstract get needsFullReinit(): boolean;
    abstract getNewValue(old?: Setting[]): Setting[];
}

export class SettingsUpdateError extends SettingError {
    constructor(reason: unknown) {
        super(`Couldn't update the settings key: ${inspect(reason)}`);
    }
    get needsFullReinit(): boolean {
        return true;
    }
    getNewValue(_old?: Setting[]): Setting[] {
        return DEFAULT_SETTINGS;
    }
}

export class SettingsKeyMissingError extends SettingError {
    constructor(reason: unknown) {
        super(`Couldn't access async storage settings key: ${inspect(reason)}`);
    }
    get needsFullReinit(): boolean {
        return true;
    }
    getNewValue(_old?: Setting[]): Setting[] {
        return DEFAULT_SETTINGS;
    }
}

export class SettingCorruptedError extends SettingError {
    constructor(reason: unknown) {
        super(`Couldn't parse settings: ${inspect(reason)}`);
    }
    get needsFullReinit(): boolean {
        return true;
    }
    getNewValue(_old?: Setting[]): Setting[] {
        return DEFAULT_SETTINGS;
    }
}

export class SettingMissingError extends SettingError {
    constructor(private missingSettings: Setting[]) {
        super(
            `Settings object was missing keys ${missingSettings
                .map(s => s.id)
                .join(', ')}`,
        );
    }
    get needsFullReinit(): boolean {
        return false;
    }
    getNewValue(old?: Setting[]): Setting[] {
        if (old) {
            return [
                ...old.filter(s =>
                    this.missingSettings.every(missing => missing.id !== s.id),
                ),
                ...this.missingSettings,
            ];
        } else {
            return this.getNewValue(DEFAULT_SETTINGS);
        }
    }
}

function inspect(value: unknown): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch (e) {
        return String(value);
    }
}
