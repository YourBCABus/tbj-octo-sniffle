import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

import Landing from './src/pages/Landing';
import Main from './src/pages/Main';
import Settings from './src/pages/Settings';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <StatusBar barStyle="light-content" translucent={true} />
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
    </ApolloProvider>

  );
}