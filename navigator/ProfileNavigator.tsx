import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import JourneyHistoryScreen from '../screens/JourneyHistoryScreen'
import {RootStackParamList} from '../screens/ProfileStackParams'

const ProfileStack = createStackNavigator<RootStackParamList>();
interface Props {
    navigation: any
}

const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator
        initialRouteName="Profile screen"
        headerMode="none"
        >
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

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 100,
        alignItems: 'center'
    },
})

export default ProfileNavigator