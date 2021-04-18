import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapTile from "../components/MapTile";
import * as Location from "expo-location";

const MockState = {
	latitude: 10.777286285607193,
	longitude: 106.65850722423563,
	// latitudeDelta: 0.0422,
	// longitudeDelta: 0.0422,
};
const getMockGeoLocations = async () => {
	return MockState;
};

interface PermissionStatus {
	status: "granted" | "undetermined" | "denied";
}

// Previous Screen -> Call Map Screen /:id -> fetch Routes based on that req.params.id -> pass fetched results to MapTile components for route

const MapScreen: React.FC = () => {
	const [userLocation, setUserLocation] = useState<any>(null);
	const [userLocationStr, setUserLocationStr] = useState<any>(""); // format example: "10.734327169637687,106.6536388713616"
	const [errorMsg, setErrorMsg] = useState<string>(""); // format example: "10.777394316429763,106.65844016839915"
	const [destinationStr, setDestinationStr] = useState<string>("");

	const fetchGeoLocation = async () => {
		try {
			const mockLocation = await getMockGeoLocations();
			// console.log(mockLocation);
			return mockLocation;
		} catch (error) {
			console.log(error);
		}
	};

	// Fetch and Set the state of destination's geolocation
	useEffect(() => {
		(async () => {
			if (destinationStr == "") {
				let result = await fetchGeoLocation();
				setDestinationStr(Object.values(result!).join(","));
			}
		})();
	}, []);

	// callback login on destinationString
	// useEffect(() => {
	// 	console.log(destinationStr);
	// 	console.log(userLocationStr);
	// }, [destinationStr, userLocationStr]);
	// useEffect(() => {
	// 	console.log(userLocation);
	// }, [userLocationStr]);

	// fetch User Location
	useEffect(() => {
		(async () => {
			let { status }: PermissionStatus = await Location.requestPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setUserLocation(location);
		})();
	}, []);
	// handle error retrieving location
	let text = "Waiting..";
	if (errorMsg) {
		text = errorMsg;
	} else if (userLocation) {
		text = JSON.stringify(userLocation);
	}

	// set User Location coordinates string
	useEffect(() => {
		if (userLocation !== null) {
			setUserLocationStr(`${userLocation.coords.latitude},${userLocation.coords.longitude}`);
		}
	}, [userLocation]);

	return (
		<>
			{userLocationStr && destinationStr ? (
				<MapTile startGeoLocation={userLocationStr} finishGeoLocation={destinationStr} />
			) : (
				<View>
					<Text>Loading...</Text>
				</View>
			)}
		</>
	);
};

export default MapScreen;
