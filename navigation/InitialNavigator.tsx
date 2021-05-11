import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import SplashScreen from '../screens/SplashScreen'
import AppNavigator from '../navigation/AppNavigator'
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from "expo-location";

const Stack = createStackNavigator();


const InitialNavigator = () => {

    const [address, setAddress] = useState("")
    const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

    useEffect(() => {
        CheckIfLocationEnabled();
        GetCurrentLocation();
      },[address]);
    
    
      const GetCurrentLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
      
        if (status !== 'granted') {
          Alert.alert(
            'Permission not granted',
            'Allow the app to use location service.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      
        let { coords } = await Location.getCurrentPositionAsync();
      
        if (coords) {
          const { latitude, longitude } = coords;
          let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
          });
      
    
          for (let item of response) {
            setAddress(`${item.street}`);
          }
    
        }
      };
    
    
      const CheckIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
    
        if (!enabled) {
          Alert.alert(
            'Location Service not enabled',
            'Please enable your location services to continue',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        } else {
          setLocationServiceEnabled(enabled);
        }
      };
    



    return (
        <Stack.Navigator
        headerMode="none"
        >
            {address!=""? (
                <Stack.Screen
                name="home"
                children={() => (<AppNavigator address={address}/>)}
                />
            ) :
            <Stack.Screen
            name="splash"
            component={SplashScreen}
            />
            }
           
          
        </Stack.Navigator>
    )
}
  export default InitialNavigator;