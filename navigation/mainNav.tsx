import React, { FC } from 'react'
import {NavigationContainer} from '@react-navigation/native'
import AuthStack from './authstack'
// import firebase from 'firebase'

const MainNav : FC = () => {
    return(
        <NavigationContainer>
            <AuthStack />
        </NavigationContainer>
    )
}

export default MainNav;