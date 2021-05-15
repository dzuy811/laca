import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image } from 'react-native'
import React from 'react'
import AttractionNavigator from '../navigator/AttractionNavigator'
import ProfileNavigator from '../navigator/ProfileNavigator'
import RankingScreen from '../screens/RankingScreen'
import FriendNavigator from '../navigator/FriendNavigator';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";


const Tab = createBottomTabNavigator();

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



const AppNavigator = (props) => {

    console.log("app navigator props: ", props);
    

    return (
        <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            let styleIcon;
                            if (route.name === 'La Cà') {
                                iconName = require('../assets/sneaker.png')
                            }
                            else if (route.name === 'Search') {
                                iconName = require('../assets/loupe.png')
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
                        children={() => (<AttractionNavigator address={props.address}/>)}
                        options={({ route }) => ({
                            tabBarVisible: getTabBarVisibility(route)
                        })}
                    />
                    <Tab.Screen
                        name="Search"
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
    )
}


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
  
export default AppNavigator