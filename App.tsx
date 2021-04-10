import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DescriptionTab from './components/DescriptionTab';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AnimatedHeader from './components/AnimatedHeader';
import MainNav from './navigation/mainNav';

export default function App() {
  return (
  <View style={styles.containerLogin}>
    <StatusBar/>
    <MainNav/>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogin: {
    flex: 1,
    backgroundColor: "#4B8FD2"
  }
});
