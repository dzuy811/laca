import React, { FC, useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './authstack'
import AppStack from './appstack'
// import firebase from 'firebase'

const MainNav : FC = () => {
    const [user, setUser] = useState(null);

    const bootstrap = () => {}

    useEffect(() => {
        bootstrap()
    }, [])

    return(
        <NavigationContainer>
            {user != null ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default MainNav;