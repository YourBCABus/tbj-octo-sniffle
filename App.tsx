import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View, } from 'react-native';
import { DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

import Landing from './src/pages/Landing';

export default function App(): JSX.Element {
  return (
    <Landing />

    // <SafeAreaView className={backgroundStyle}>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     className={backgroundStyle}>
    //     <Header />
    //     <Initial />
    //     <View className="bg-white dark:bg-black">
    //       <Section title="Step One">
    //         Edit <Text className="font-bold">App.js</Text> to change this
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
}