import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export default function App(): JSX.Element {
    return (
        <GestureHandlerRootView className="flex-1 h-full">
            {/* The backgroundColor is currently a non-working hack for the web version. */}
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="#09090b"
            />
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        orientation: 'portrait',
                    }}>
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
                        options={{ title: 'SignIn' }}
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
        </GestureHandlerRootView>
    );
}
