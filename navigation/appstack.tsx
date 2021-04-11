import React, { FC } from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import { Login } from '../screens'
const { Navigator, Screen } = createStackNavigator();
import HomeScreen from '../screens/HomeScreen'
import AttractionMap from '../screens/AttractionMap'
import AttractionNavigator from '../navigator/AttractionNavigator'

import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AttractionList from '../components/AttractionList';
import AttractionCard from '../components/AttractionCard';
const AppStack : FC = () => {
    return(
       
        <Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen name="login" component={Login} />
        </Navigator>
    )
}

export default AppStack;