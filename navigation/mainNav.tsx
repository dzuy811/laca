import React, { FC, useState, useEffect } from 'react'
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './authstack'
import LoginButton from '../components/LoginButton'
import AppStack from './appstack'
import firebase from 'firebase'
import HomeScreen from '../screens/HomeScreen'
import AttractionMap from '../screens/AttractionMap'
import AttractionNavigator from '../navigator/AttractionNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AttractionList from '../components/AttractionList';
import AttractionCard from '../components/AttractionCard';

const Tab = createBottomTabNavigator();

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
                  <Tab.Navigator>
        <Tab.Screen
        name="main"
        component={AttractionNavigator}/>
        {/* <Tab.Screen 
        name="AttractionMap"
        children={()=><AttractionMap latitude={10.759327992014628} longitude={106.70257070404554}/>}
        /> */}
      </Tab.Navigator>
    </View>

            : <AuthStack />}
        </NavigationContainer>
        
    )
}

export default MainNav;