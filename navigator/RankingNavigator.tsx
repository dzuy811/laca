import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import RankingScreen from '../screens/RankingScreen'
import {RootStackParamList} from './RankingStackParams'
import OtherProfileScreen from '../screens/OtherProfileScreen';
import FriendProfile from '../screens/FriendProfile';

const RankingStack = createStackNavigator<RootStackParamList>();

const RankingNavigator = () => {
    console.log("ranking navigator");
    
    return (
        <RankingStack.Navigator
        initialRouteName="Ranking"
        headerMode="none"
        >
            <RankingStack.Screen
            name="Ranking"
            component={RankingScreen}
            />
            <RankingStack.Screen
            name="User Profile"
            component={OtherProfileScreen}
            />
            <RankingStack.Screen
            name="Friend Profile"
            component={FriendProfile}
            />
        </RankingStack.Navigator>
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

export default RankingNavigator