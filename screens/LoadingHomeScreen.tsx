import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import { AppLogo } from '../components';

type LoadingHomeScreenType = {
    navigation: any,
}

const LoadingHomeScreen:React.FC<LoadingHomeScreenType> = ({ navigation }) => {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Wait, we are fetching you location...'
  );

useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);


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
        let address = `${item.street}`;
  
        setDisplayCurrentAddress(address);
        if (address.length > 0) {
            setTimeout(() => {
              navigation.navigate('Home', { item: address });
            }, 2000);
          }
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
    <View style={styles.container}>
      <AppLogo />
      <Text style={styles.text}>
          Let's start your journey from here with us!
      </Text>
    </View>
  );
};

// styles remain same

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#4B8FD2',
      alignItems: 'center',
      paddingTop: 200
    },
    contentContainer: {
      alignItems: 'center',
      marginBottom: 20
    },
    image: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FD0139'
    },
    text: {
      fontSize: 20,
      fontWeight: '400',
      color: '#fff'
    }
  });
  

export default LoadingHomeScreen;