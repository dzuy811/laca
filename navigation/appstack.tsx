import React, { FC } from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import UserProfile  from '../screens/UserProfile';

const { Navigator, Screen } = createStackNavigator();

const AppStack : FC = () => {
    return(
       
        <Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen name="user-profile" component={UserProfile} />
        </Navigator>
    )
}

export default AppStack;