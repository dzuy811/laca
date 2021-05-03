import React, { FC, useState, useEffect } from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer } from "@react-navigation/native";
import AuthStack from "./authstack";
import { Image, StyleSheet } from "react-native";
import { storeData, getData } from "../constants/utility";

import firebase from "firebase";

import AttractionNavigator from '../navigator/AttractionNavigator'
import ProfileNavigator from '../navigator/ProfileNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RankingScreen from '../screens/RankingScreen'
import FriendScreen from '../screens/FriendScreen'
import FriendNavigator from '../navigator/FriendNavigator';

// Function to hide tab bar for some screen
// docs: https://reactnavigation.org/docs/screen-options-resolution/
// stackoverflow: https://stackoverflow.com/questions/60177053/react-navigation-5-hide-tab-bar-from-stack-navigator
const getTabBarVisibility = (route: any) => {
	const routeName = getFocusedRouteNameFromRoute(route);

	if (
		routeName === "Edit profile" ||
		routeName === "Journey history" ||
		routeName === "Attraction detail"
	) {
		return false;
	}
	return true;
};

const Tab = createBottomTabNavigator();

const MainNav: FC = () => {
	const [user, setUser] = useState<any>(null);
	const [userData, setUserData] = useState<any>(null);

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


	// Fetch details about current user save to the Async Storage
	useEffect(() => {
		if (user != null && typeof user !== "undefined") {
			const user = firebase.auth().currentUser;
			(() => {
				firebase
					.firestore()
					.collection("users")
					.doc(user?.uid)
					.get()
					.then((user_info) => {
						const data = user_info.data();
						if (data != null && typeof data !== "undefined") {
							setUserData(data);
							storeData("id", user_info.id);
							storeData("address_line_1", data.address[0]);
							storeData("address_line_2", data.address[1]);
							storeData("name", data.name);
							storeData("gender", data.gender);
							storeData("phone_number", data.phoneNumber);
							storeData("url_avatar", data.urlAvatar);
						}
					})
					.catch((error) => {
						console.log("error:", error);
					});
			})();
		}
	}, [user]);

	useEffect(() => {
		(async () => {
			if (userData != null && typeof userData !== "undefined") {
				const name = await getData("name");
				const id = await getData("id");
				console.log(`${name} (${id}) has logged in successfully!`);
			}
		})();
	}, [userData]);
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
                        component={FriendNavigator}
                    />
                    <Tab.Screen
                        name="Ranking"
                        component={RankingScreen}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileNavigator}
                        options={({ route }) => ({
                            tabBarVisible: getTabBarVisibility(route)
                        })}
                    />
                </Tab.Navigator>
			 : (
				<AuthStack />
			)}
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	tabBarIcon: {
		width: 24,
		height: 24,
	},
	focusIcon: {
		tintColor: "#DFEBF7",
	},
	unFocusIcon: {
		tintColor: "#8DBAE2",
	},
});

export default MainNav;
