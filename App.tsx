import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainNav from './navigation/mainNav';

export default function App() {
  return (
      <MainNav />
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#4B8FD2",
	},
});
