import React, { FC } from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import {LogIn} from '../screens'
const {Navigator,Screen} = createStackNavigator();

const AppStack : FC = () => {
    return(
        <Navigator>
            <Screen name="login" component={LogIn} />
        </Navigator>
    )
}

export default AppStack;