import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DescriptionTab from './components/DescriptionTab';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AnimatedHeader from './components/AnimatedHeader';

export default function App() {
  return (

    <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }} >
      <DescriptionTab/>
      {/* <AnimatedHeader/> */}
    </SafeAreaView>
  </SafeAreaProvider>
  // <View>
  //   <DescriptionTab/>
  // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
