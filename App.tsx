import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View , Text} from 'react-native';
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

export default function App() {

  return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen
//         name="main"
//         component={AttractionNavigator}/>
//         {/* <Tab.Screen 
//         name="AttractionMap"
//         children={()=><AttractionMap latitude={10.759327992014628} longitude={106.70257070404554}/>}
//         /> */}
//       </Tab.Navigator>
//     </NavigationContainer>

	  <View>
		<StatusBar />
      	{/* <MainNav /> */}
		<UserProfile />
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
