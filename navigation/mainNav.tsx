import React, { FC, useState, useEffect } from 'react'
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './authstack'
import LoginButton from '../components/LoginButton'
import AppStack from './appstack'
import firebase from 'firebase'

const MainNav : FC = () => {

    const signOut = () => {
        firebase.auth().signOut();
    }
    
    const [user, setUser] = useState<any>(null);

    const bootstrap = () => {
        firebase.auth().onAuthStateChanged(_user => {
            if(_user) {
                setUser(_user);
            }
        })
    }

    useEffect(() => {
        bootstrap()
    }, [])

    return(
        <NavigationContainer>
            {user != null ? 
            <View style={{flex:1, alignItems: 'center', alignSelf:'center'}}>
                <LoginButton title="Sign Out" onPress={signOut}></LoginButton>
            </View>
            : <AuthStack />}
        </NavigationContainer>
    )
}

export default MainNav;