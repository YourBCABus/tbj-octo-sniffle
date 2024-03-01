import Landing from '../pages/Landing';
import InitialSettings from '../pages/InitialSettings';

import Main from '../pages/Main';
import Settings from '../pages/Settings';

import ClientKeySetup from '../pages/ClientKeySetup';

export enum Pages {
    LANDING = 'TableJet - Landing',
    INITIAL_SETTINGS = 'TableJet - Initial Settings',

    MAIN = 'TableJet',
    SETTINGS = 'TableJet - Settings',

    CLIENT_KEY_SETUP = 'TableJet - Please Wait...',
}

export const urls = {
    [Pages.LANDING]: '/welcome',
    [Pages.INITIAL_SETTINGS]: '/setup',
    [Pages.MAIN]: '/',
    [Pages.SETTINGS]: '/settings',
    [Pages.CLIENT_KEY_SETUP]: '/client-key-setup/:id/:secret',
};

export const linking = {
    prefixes: ['https://tablejet.com'],
    config: {
        ...urls,
    },
};

export const Components = {
    [Pages.LANDING]: Landing,
    [Pages.INITIAL_SETTINGS]: InitialSettings,
    [Pages.MAIN]: Main,
    [Pages.SETTINGS]: Settings,
    [Pages.CLIENT_KEY_SETUP]: ClientKeySetup,
};
