import React, { Component, useState, useEffect, JSXElementConstructor } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import * as Location from "expo-location";
import LoadingHomeScreen from "../screens/LoadingHomeScreen";
import AttractionList from "../components/AttractionList";
import GGLogo from "../assets/gg_logo.jpg";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import * as firebase from "firebase";

type homeScreenProps = {

    navigation: any,
}

const HomeScreen:React.FC<homeScreenProps> = ({navigation}, props) => {


    const [data, setData] = useState([])

    useEffect(() => {
        fetch('https://asia-east2-laca-59b8c.cloudfunctions.net/api/attractions')
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


    const item  = address

    return (
        <View style={{flex: 1, backgroundColor: '#FCFCFC'}}>
                <Header
                leftComponent={
                    <Text style={{color: '#fff'}}>{item || "Location not available"}</Text>
                }
                leftContainerStyle={{flex:4}}
                />
                <View style={style.cardList}>
                    <AttractionList navigation={navigation} attractions={data}/>
                </View>
                
        </View>
    )
}

export default HomeScreen

const style = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: "#4B8FD2",
		height: 100,
		alignItems: "center",
	},
	sectionHeading: {
		color: "#4B8FD2",
	},
	cardList: {
		marginLeft: 20,
		marginTop: 100,
		alignItems: "stretch",
		justifyContent: "center",
	},
	button: {
		backgroundColor: "blue",
		padding: 20,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 20,
		color: "#fff",
	},
});
