import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Landing from './src/pages/Landing';
import Main from './src/pages/Main';
import Settings from './src/pages/Settings';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} options={{title: 'Landing'}} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Settings" component={Settings} 
          options={{ 
            headerShown: true, 
            headerTransparent: true,
            headerTintColor: 'white',
          }}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
}