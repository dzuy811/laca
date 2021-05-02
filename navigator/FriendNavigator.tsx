import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import FriendScreen from '../screens/FriendScreen'
import JourneyHistoryScreen from '../screens/JourneyHistoryScreen'
import {RootStackParamList} from './FriendStackParams'
import UserProfile from '../screens/UserProfile';

const FriendStack = createStackNavigator<RootStackParamList>();

const FriendNavigator = () => {
    return (
        <FriendStack.Navigator
        initialRouteName="Search user"
        headerMode="none"
        >
            <FriendStack.Screen
            name="Search user"
            component={FriendScreen}
            />
            <FriendStack.Screen
            name="User Profile"
            component={UserProfile}
            />
        </FriendStack.Navigator>
    )
}

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 100,
        alignItems: 'center'
    },
})

export default FriendNavigator