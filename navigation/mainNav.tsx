import React, { FC, useState, useEffect } from 'react'
import { getFocusedRouteNameFromRoute, NavigationContainer, useRoute } from '@react-navigation/native'
import AuthStack from './authstack'

import firebase from 'firebase'

import AttractionNavigator from '../navigator/AttractionNavigator'
import ProfileNavigator from '../navigator/ProfileNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Function to hide tab bar for some screen
// docs: https://reactnavigation.org/docs/screen-options-resolution/
// stackoverflow: https://stackoverflow.com/questions/60177053/react-navigation-5-hide-tab-bar-from-stack-navigator
const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route)

    if (routeName === 'Edit profile'
        || routeName === 'Journey history'
        || routeName === 'Attraction detail') {
        return false;
    }
    return true;
}

const Tab = createBottomTabNavigator();

const MainNav : FC = () => {

    const signOut = () => {
        firebase.auth().signOut();
    }
    
    const [user, setUser] = useState<any>(null);

    const bootstrap = () => {
        firebase.auth().onAuthStateChanged(_user => {
            if(_user) {
                setUser(_user);
            }
        })
    }

    useEffect(() => {
        bootstrap()
    }, [])

    return(
        <NavigationContainer>
            {user != null ? 
                  <Tab.Navigator>
        <Tab.Screen
        name="main"
        component={AttractionNavigator}
        options={({route}) => ({
            tabBarVisible: getTabBarVisibility(route)
        })}
        />
        <Tab.Screen 
        name="profile"
        component={ProfileNavigator}
        options={({route}) => ({
            tabBarVisible: getTabBarVisibility(route)
        })}
        />
      </Tab.Navigator>

            : <AuthStack />}
        </NavigationContainer>
        
    )
}

export default MainNav;