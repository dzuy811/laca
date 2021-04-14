import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import JourneyHistoryScreen from '../screens/JourneyHistoryScreen'
import {RootStackParamList} from '../screens/ProfileStackParams'

const ProfileStack = createStackNavigator<RootStackParamList>();

const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator
        headerMode="none"
        initialRouteName="Profile screen">
            <ProfileStack.Screen
            name="Profile screen"
            component={ProfileScreen}
            />
            <ProfileStack.Screen
            name="Journey history"
            component={JourneyHistoryScreen}
            />
        </ProfileStack.Navigator>
    )
}

export default ProfileNavigator