import React, { FC } from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import { Login, SignUp, PhoneAuth } from '../screens'
const { Navigator, Screen } = createStackNavigator();

const AuthStack : FC = () => {
    return(
        <Navigator   
            screenOptions={{
                headerShown: false
            }}
        > 
            <Screen name="login" component={Login} />
            <Screen name="phoneAuth" component={PhoneAuth} />
            <Screen name="signUp" component={SignUp} />
        </Navigator>
    )
}

export default AuthStack;