import * as React from 'react';
import { Context } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Landing from './src/pages/Landing';
import Main from './src/pages/Main';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import InitialSettings from './src/pages/InitialSettings';
import Error from './src/pages/Error';

import { StatusBar } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
    web: 'native',
});

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [
        'http://localhost:8080',
        'https://tablejet.app',
        'https://tbj.yourbcabus.com',
    ],
    config: {
        screens: {
            'TableJet - Landing': '',
            'TableJet - Error': 'error',
            'TableJet - Sign In': 'signin',
            TableJet: 'dashboard',
            'TableJet - Initial Settings': 'setup',
            'TableJet - Settings': 'settings',
        },
    },
};

export const IdTokenContext: Context<
    [string | null, (value: string | null) => void]
> = React.createContext([null, () => {}] as any);
export const CanBypassFrontendDomainRestrictionsContext: Context<
    [boolean, (value: boolean) => void]
> = React.createContext([false, () => {}] as any);

export default function App(): JSX.Element {
    const [idToken, setIdToken] = React.useState<string | null>(null);
    const [canBypass, setCanBypass] = React.useState<boolean>(false);

    return (
        <GestureHandlerRootView className="flex-1 h-full">
            {/* The backgroundColor is currently a non-working hack for the web version. */}
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="#09090b"
            />
            <IdTokenContext.Provider value={[idToken, setIdToken]}>
                <CanBypassFrontendDomainRestrictionsContext.Provider
                    value={[canBypass, setCanBypass]}>
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                                orientation: 'portrait',
                            }}
                            initialRouteName="Landing">
                            <Stack.Screen
                                name="TableJet - Landing"
                                component={Landing}
                                options={{ title: 'Landing' }}
                            />
                            <Stack.Screen
                                name="TableJet - Error"
                                component={Error}
                                options={{ title: 'Error' }}
                            />
                            <Stack.Screen
                                name="TableJet - Sign In"
                                component={SignIn}
                                options={{ title: 'Sign In' }}
                            />

                            <Stack.Screen name="TableJet" component={Main} />
                            <Stack.Screen
                                name="TableJet - Initial Settings"
                                component={InitialSettings as any}
                                initialParams={{ page: 'NOTIFS' }}
                            />
                            <Stack.Screen
                                name="TableJet - Settings"
                                component={Settings}
                                options={{
                                    headerShown: true,
                                    headerTransparent: true,
                                    headerTintColor: 'white',
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </CanBypassFrontendDomainRestrictionsContext.Provider>
            </IdTokenContext.Provider>
        </GestureHandlerRootView>
    );
}
