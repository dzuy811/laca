import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { Ionicons, AntDesign, EvilIcons } from "@expo/vector-icons";
import MapTile from "../components/MapTile";
import * as Location from "expo-location";

interface PermissionStatus {
	status: "granted" | "undetermined" | "denied";
}

interface Props {
	route: any;
	navigation: any;
}

// Previous Screen -> Call Map Screen /:id -> fetch Routes based on that req.params.id -> pass fetched results to MapTile components for route

const MapScreen: React.FC<Props> = ({ route, navigation }) => {
	const [userLocation, setUserLocation] = useState<any>(null);
	const [userLocationStr, setUserLocationStr] = useState<any>(""); // format example: "10.734327169637687,106.6536388713616"
	const [errorMsg, setErrorMsg] = useState<string>(""); // format example: "10.777394316429763,106.65844016839915"
	const [destinationStr, setDestinationStr] = useState<string>("");
	const [isArrived, setIsArrived] = useState<boolean>();
	const [image, setImage] = useState<any>("");


	// Fetch and Set the state of destination's geolocation
	useEffect(() => {
		setDestinationStr(Object.values(route.params!).join(","));
	}, []);

	// Ask for the current location of the user and permission to turn on GPS
	const getUserLocation = async () => {
		let { status }: PermissionStatus = await Location.requestPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		setUserLocation(location);
	};

	// Fetch User Location
	useEffect(() => {
		getUserLocation();
	}, []);

	useEffect(() => {
		console.log(userLocationStr);
	}, [userLocationStr]);

	// Handle error retrieving location
	let text = "Waiting..";
	if (errorMsg) {
		text = errorMsg;
	} else if (userLocation) {
		text = JSON.stringify(userLocation);
	}

	// Get User Location coordinates string
	useEffect(() => {
		if (userLocation !== null) {
			setUserLocationStr(`${userLocation.coords.latitude},${userLocation.coords.longitude}`);
		}
	}, [userLocation]);

	// Calculate distance between two coordinates in kilometers (Bird-fly route)
	const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
		var p = 0.017453292519943295; // Math.PI / 180
		var c = Math.cos;
		var a =
			0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	};

	// Alert near distance
	useEffect(() => {
		if (userLocationStr) {
			// calculate distance between latitudes and coordinates of two locations
			let dist = distance(
				parseFloat(userLocationStr.split(",")[0]),
				parseFloat(userLocationStr.split(",")[1]),
				parseFloat(destinationStr.split(",")[0]),
				parseFloat(destinationStr.split(",")[1])
			);
			// if the user is within the radius of 100meters -> user has arrived!
			if (dist <= 0.1) {
				setIsArrived(true);
				navigation.navigate('Camera screen')
				return;
			}
			setIsArrived(false);
			console.log(`${dist}km left`);
			return;
		}
	}, [userLocationStr]);

	// Callback to re-check if the user has arrived or not?
	useEffect(() => {
		if (isArrived) {
			console.log("User has arrived to the destination!");
			return;
		} else if (typeof isArrived !== "undefined") {
			console.log("User has NOT arrived yet!");
		}
	}, [isArrived]);

	// Create Alert Message upon arrival to the destination
	// const createTwoButtonAlert = () =>
	// 	Alert.alert(
	// 		"Congratulations!",
	// 		"You have arrived to the COOL place!",
	// 		[
	// 			{
	// 				text: "Dismiss",
	// 				onPress: () => console.log("Cancel Pressed"),
	// 				style: "cancel",
	// 			},
	// 			{ text: "OK", onPress: pickImage },
	// 		],
	// 		{ cancelable: false }
	// 	);

	return (
		<>
			{userLocationStr && destinationStr ? (
				<>
					<MapTile
						startGeoLocation={userLocationStr}
						finishGeoLocation={destinationStr}
						navigation={navigation}
					/>
					<TouchableOpacity style={styles.overlayRight} onPress={getUserLocation}>
						<Ionicons name="md-refresh-circle-outline" size={50} color="#4B8FD2" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.overlayLeft}
						onPress={() => {
							navigation.navigate("Attraction detail");
						}}
					>
						<AntDesign name="leftcircleo" size={40} color="#4B8FD2" />
					</TouchableOpacity>
					{isArrived ? <></> : <></>}
				</>
			) : (
				<View style={styles.overlayCenter}>
					<ActivityIndicator size="large" color="#2966A3" />
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	overlayRight: {
		position: "absolute",
		top: 30,
		right: 15,
	},
	overlayLeft: {
		position: "absolute",
		top: 36,
		left: 15,
	},
	overlayCenter: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default MapScreen;
