import React from 'react'
import { StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import RankingScreen from '../screens/RankingScreen'
import {RootStackParamList} from './RankingStackParams'
import OtherProfileScreen from '../screens/OtherProfileScreen';

const RankingStack = createStackNavigator<RootStackParamList>();

const FriendNavigator = () => {
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

export default FriendNavigator