import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import HomeScreen from '../screens/HomeScreen'
import AttractionMap from '../screens/AttractionMap'
import DescriptionTab from '../screens/DescriptionTab';
import * as Location from 'expo-location';
import LoadingHomeScreen from '../screens/LoadingHomeScreen';
import { MapScreen } from '../screens';


const Stack = createStackNavigator();

type props = {
  navigation: any;
}

const AttractionNavigator:React.FC<props> = ({navigation}) => {

  const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://192.168.2.104:5001/laca-59b8c/us-central1/api/attractions')
        .then((response) => response.json())
        .then((json) => {
            setData(json)
            console.log("Attraction list" ) // For debugging. Check if the effect is called multiple times or not
        })
        .catch((err) => console.error(err))
    },[])

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [address, setAddress] = useState("")
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

  if (address=="") {
    return (
      <LoadingHomeScreen/>
    )
  }


  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Home"
          children={ () =>
            <HomeScreen address={address} data={data} navigation={navigation} />
          }
        />
        <Stack.Screen name="Description" component={DescriptionTab}/>
        <Stack.Screen name="Journey Map" component={MapScreen} />
      </Stack.Navigator>

  );
};

export default AttractionNavigator