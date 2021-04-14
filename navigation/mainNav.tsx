import React, { FC, useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './authstack'

import firebase from 'firebase'

import AttractionNavigator from '../navigator/AttractionNavigator'
import ProfileNavigator from '../navigator/ProfileNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
        component={AttractionNavigator}/>
        <Tab.Screen 
        name="profile"
        component={ProfileNavigator}/>
      </Tab.Navigator>

            : <AuthStack />}
        </NavigationContainer>
        
    )
}

export default MainNav;