import React, { FC, useState, useEffect } from 'react'
import { getFocusedRouteNameFromRoute, NavigationContainer, useRoute } from '@react-navigation/native'
import AuthStack from './authstack'
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native'

import firebase from "firebase";

import AttractionNavigator from '../navigator/AttractionNavigator'
import ProfileNavigator from '../navigator/ProfileNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';

// Function to hide tab bar for some screen
// docs: https://reactnavigation.org/docs/screen-options-resolution/
// stackoverflow: https://stackoverflow.com/questions/60177053/react-navigation-5-hide-tab-bar-from-stack-navigator
const getTabBarVisibility = (route: any) => {
	const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName === 'Edit profile'
        || routeName === 'Journey history'
        || routeName === 'Attraction detail') {
        return false;
    }
    return true;
}

const Tab = createBottomTabNavigator();

const MainNav: FC = () => {
	const signOut = () => {
		firebase.auth().signOut();
	};

	const [user, setUser] = useState<any>(null);

	const bootstrap = () => {
		firebase.auth().onAuthStateChanged((_user) => {
			if (_user) {
				setUser(_user);
			}
		});
	};

	useEffect(() => {
		bootstrap();
	}, []);

    return (
        <NavigationContainer>
            {user != null ?
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            let styleIcon;
                            if (route.name === 'La Cà') {
                                iconName = require('../assets/sneaker.png')
                            }
                            else if (route.name === 'Shop') {
                                iconName = require('../assets/store.png')
                                styleIcon = focused ? styles.focusIcon : styles.unFocusIcon
                            }
                            else if (route.name === 'Ranking') {
                                iconName = require('../assets/bar-chart.png')
                                styleIcon = focused ? styles.focusIcon : styles.unFocusIcon
                            }
                            else if (route.name === 'Profile') {
                                iconName = require('../assets/user.png')
                                styleIcon = focused ? styles.focusIcon : styles.unFocusIcon
                            }

                            // You can return any component that you like here!
                            return <Image
                                source={iconName}
                                style={[styles.tabBarIcon, focused ? styles.focusIcon : styles.unFocusIcon]}
                            />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: '#DFEBF7',
                        inactiveTintColor: '#8DBAE2',
                        style: {
                            backgroundColor: '#4B8FD2'
                        },
                        keyboardHidesTabBar: true
                    }}

                >
                    <Tab.Screen
                        name="La Cà"
                        component={AttractionNavigator}
                        options={({ route }) => ({
                            tabBarVisible: getTabBarVisibility(route)
                        })}
                    />
                    <Tab.Screen
                        name="Shop"
                        component={ProfileScreen}
                    />
                    <Tab.Screen
                        name="Ranking"
                        component={ProfileScreen}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileNavigator}
                        options={({ route }) => ({
                            tabBarVisible: getTabBarVisibility(route)
                        })}
                    />
                </Tab.Navigator>

                : <AuthStack />}
        </NavigationContainer>

    )
}

const styles = StyleSheet.create({
    tabBarIcon: {
        width: 24,
        height: 24
    },
    focusIcon: {
        tintColor: '#DFEBF7',
    },
    unFocusIcon: {
        tintColor: '#8DBAE2'
    }
})

export default MainNav;
