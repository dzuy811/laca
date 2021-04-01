import React, { FC } from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import {LogIn} from '../screens'
const {Navigator,Screen} = createStackNavigator();

const AuthStack : FC = () => {
    return(
        <Navigator   
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen name="login" component={LogIn} />
        </Navigator>
    )
}

export default AuthStack;