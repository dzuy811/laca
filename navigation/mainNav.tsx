import React, { FC, useState, useEffect } from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer } from "@react-navigation/native";
import AuthStack from "./authstack";
import { Image, StyleSheet, Platform, Alert } from "react-native";
import { storeData, getData } from "../constants/utility";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import firebase from "firebase";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InitialNavigator from './InitialNavigator'

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

    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            let updates = { 'expoToken': ''}
            updates.expoToken = token;
            let userid = await getData("id")
            console.log(userid)
            await firebase.database().ref('/users/'+ userid).update(updates)

        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {

        })
    }, [])

    return (
        <NavigationContainer>
            {user != null ?
                <InitialNavigator loading={true}/>
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
