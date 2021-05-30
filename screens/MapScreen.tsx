import React, { useEffect, useState, useCallback, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Platform,
} from "react-native";
import { Ionicons, AntDesign, EvilIcons } from "@expo/vector-icons";
import { Button, Overlay } from 'react-native-elements'
import MapTile from "../components/MapTile";
import * as Location from "expo-location";
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import firebase from "firebase";
import AppContext from '../components/AppContext' 
import axios from "axios";


interface PermissionStatus {
	status: "granted" | "undetermined" | "denied";
}

interface Props {
	route: any;
	navigation: any;
}

// Previous Screen -> Call Map Screen /:id -> fetch Routes based on that req.params.id -> pass fetched results to MapTile components for route

async function cancelJourney(journeyID: string) {
	let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/histories/${journeyID}/cancel`
	axios.put(url)
	.then(res => {
		console.log(url);
		return res
	})
	.catch(err => {
		console.log(err);
		
		return err
	})
}

const MapScreen: React.FC<Props> = ({ route, navigation }) => {
	const [userLocation, setUserLocation] = useState<any>(null);
	const [userLocationStr, setUserLocationStr] = useState<any>(""); // format example: "10.734327169637687,106.6536388713616"
	const [errorMsg, setErrorMsg] = useState<string>(""); // format example: "10.777394316429763,106.65844016839915"
	const [destinationStr, setDestinationStr] = useState<string>("");
	const [isArrived, setIsArrived] = useState<boolean>();
	const [image, setImage] = useState<any>("");
	const { latitude, longitude, journeyID, attractionID, reward} = route.params
	const userGlobalData = useContext(AppContext);
	const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
      setVisible(!visible);
    };


	//Background task defined
	// const GET_USER_LOCATION = 'GET_USER_LOCATION'
	// TaskManager.defineTask(GET_USER_LOCATION, async () => {
	// 	const a =  await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});	
	// 	console.log("wtfL ", a);
		
	// 	  return a
	// 	  ? BackgroundFetch.Result.NewData
	// 	  : BackgroundFetch.Result.NoData
		
	// })


	// Fetch and Set the state of destination's geolocation
	useEffect(() => {

		/* 
			UNDER RESEARCH
		*/

		// const initBackgroundFetch = async() => {
		// 	const backgroundFetchStatus = await BackgroundFetch.getStatusAsync();
        // switch (backgroundFetchStatus) {
        //   case BackgroundFetch.Status.Restricted:
        //     console.log("Background fetch execution is restricted");
        //     return;

        //   case BackgroundFetch.Status.Denied:
        //     console.log("Background fetch execution is disabled");
        //     return;

        //   default:
        //     console.log("Background fetch execution allowed");

        //     let isRegistered = await TaskManager.isTaskRegisteredAsync(
        //       GET_USER_LOCATION
        //     );
        //     if (isRegistered) {
        //       console.log(`Task ${GET_USER_LOCATION} already registered`);
        //     } else {
        //       console.log("Background Fetch Task not found - Registering task");
        //     }
        //     await BackgroundFetch.registerTaskAsync(GET_USER_LOCATION, {
        //       minimumInterval: 10,
        //       startOnBoot: false,
        //       stopOnTerminate: false
        //     });}
		// }
		// initBackgroundFetch()
		// BackgroundFetch.unregisterTaskAsync(GET_USER_LOCATION)
		setDestinationStr(`${latitude},${longitude}`)
		console.log(destinationStr);
		
		// BackgroundFetch.unregisterTaskAsync(GET_USER_LOCATION)
	}, []);
	
	// const getCurrentLocation = async () => {
	// 	let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});		
	// 	return location;
	// }
 
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


	// Update user current position on change
	// await Location.watchPositionAsync({}, getUserLocation).remove();


	// Location.watchPositionAsync({}, 

	// Fetch User Location
	useEffect(() => {
		console.log("Update user location");
		
		getUserLocation();
	}, []);

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
		console.log("helooooo");
		
		if (userLocationStr) {
			// calculate distance between latitudes and coordinates of two locations
			let dist = distance(
				parseFloat(userLocationStr.split(",")[0]),
				parseFloat(userLocationStr.split(",")[1]),
				parseFloat(destinationStr.split(",")[0]),
				parseFloat(destinationStr.split(",")[1])
			);
			// if the user is within the radius of 100meters -> user has arrived!
			if (dist <= 0.5) {
				setIsArrived(true);
				console.log("journey:", journeyID);
				
				navigation.navigate("Camera screen", {journeyID: journeyID, attractionID: attractionID, reward: reward});
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


	

	return (
		<>
			{userLocationStr && destinationStr ? (
				<>
					<MapTile
						startGeoLocation={userLocationStr}
						finishGeoLocation={destinationStr}
						navigation={navigation}
					/>
					<View style={styles.centeredView}>
						<View>
							<Overlay
								isVisible={visible}
								onBackdropPress={() => toggleOverlay()}
								overlayStyle={styles.overlay}
							>
								<Text style={{ fontSize: 16 }}>Are you sure you want cancel the journey?</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
									<TouchableOpacity onPress={() => toggleOverlay()}>
										<Text style={styles.cancelButton}>CANCEL</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => {
										cancelJourney(journeyID).then(() => userGlobalData.setOnJourney(false)).then(navigation.goBack())
									}}>
										<Text style={styles.confirmButton}>CONFIRM</Text>
									</TouchableOpacity>
								</View>

							</Overlay>
						</View>
					</View>
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
					<Button
						containerStyle={styles.overlayButton}
						title="Cancel the journey"
						buttonStyle={styles.button}
						titleStyle={{color: "#f8ede3"}}
						onPress={() => {
							toggleOverlay()
						}}
					/>
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
	overlayButton: {
		position: 'absolute',
		bottom: 20,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		backgroundColor: "#ce1212",
		borderColor: '#ce1212',
		width: 300,
		padding: 20,
		borderRadius: 30,
		borderWidth: 1
	},
	centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
	overlay: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '86%'
    },
	cancelButton: {
        fontSize: 15,
        marginRight: 20
    },
    confirmButton: {
        fontSize: 15,
        color: '#488fd2'
    }
});

export default MapScreen;
