import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import './constants/firebase';
import MainNav from './navigation/mainNav';

import HomeScreen from './screens/HomeScreen'
import AttractionMap from './screens/AttractionMap'
import AttractionNavigator from './navigator/AttractionNavigator'

import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AttractionList from './components/AttractionList';
import AttractionCard from './components/AttractionCard';
import UserProfile  from './screens/UserProfile';

const Tab = createBottomTabNavigator();

let barStyle: string = "light-content"

export default function App() {

  return (

	  <View style={styles.containerLogin}>
		<StatusBar
		barStyle="light-content"
		/>
      	<MainNav />

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
		backgroundColor: "#4B8FD2",
	},
});
