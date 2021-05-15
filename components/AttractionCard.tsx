import React, { Component, useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	TouchableHighlightBase,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";


type attractionType = {
	id: string;
	name: string;
	reward: number;
	rating: number;
	imageThumbnail: string;
	geoPoint: any;
	description?: string;
};

interface CardProps {
	data: attractionType;
	navigation: any;
}

interface PermissionStatus {
	status: "granted" | "undetermined" | "denied";
}

const AttractionCard:React.FC<CardProps> = (props) => {

	const [userLocationStr, setUserLocationStr] = useState<any>(""); // format example: "10.734327169637687,106.6536388713616"
	const [errorMsg, setErrorMsg] = useState<string>(""); // format example: "10.777394316429763,106.65844016839915"
	const [userLocation, setUserLocation] = useState<any>(null);
	const [distance, setDistance] = useState<number>(0);


	const getUserLocation = async () => {
		let { status }: PermissionStatus = await Location.requestPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		return location.coords
	};

	const calculateDistance = async (lat1: number, lon1: number, lat2: number, lon2: number) => {
		var p = 0.017453292519943295; // Math.PI / 180
		var c = Math.cos;
		var a =
			0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	};

	useEffect(() => {
		getUserLocation().then( async (res) => {
			calculateDistance(res.latitude, res.longitude, props.data.geoPoint._latitude, props.data.geoPoint._longitude)
		.then(res => {
			console.log("dist: ", res)
			setDistance(res)
		})

		})
	}, [])


	useEffect(() => {
		

	}, [userLocation])


		return (
			<TouchableOpacity
				onPress={() => {
					props.navigation.navigate("Attraction detail", {
						id: props.data.id,
						latitude: props.data.geoPoint._latitude,
						longitude: props.data.geoPoint._longitude,
						description: props.data.description,
						name: props.data.name,
						distance: distance
					}); // Navigate to the attraction description tab
					// Passing the latitude and longitude props
				}}
				activeOpacity={0.8}
				style={[style.cardContainer, style.item]}
			>
				<View>
					<Image style={style.cardImage} source={{ uri: `${props.data.imageThumbnail}` }} />
				</View>
				<View style={style.cardBody}>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
						<Text numberOfLines={1}  style={style.attractionName}>
							{props.data.name}
						</Text>
						<View style={{ marginRight: 12 }}>
								<Text style={{ color: "#A0A0A0", fontSize: 14, fontWeight: '100' }}>{distance.toFixed(1)}km</Text>
						</View>
						
					</View>
					<View style={{ marginTop: 10 }}>
						<View style={style.firstInfo}>
							<View style={[style.reward]}>
								<Image 
								source={require("../assets/dollar.png")}
								style={style.coinIcon} />
								<Text style={{ marginLeft: 6, fontSize: 16 }}>{props.data.reward}</Text>
							</View>
							
						</View>
						<View style={style.reward}>
							<AntDesign style={{ marginRight: 2 }} name="star" size={24} color="#FF5353" />
							<Text style={{ marginLeft: 2, fontSize: 16 }}>{props.data.rating}/5(92)</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	
}

export default AttractionCard

const style = StyleSheet.create({
	item: {
		// marginLeft: 20
	},

	cardContainer: {
		backgroundColor: "#fff",
		width: 350,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		shadowColor: '#e0e0e0',
		shadowOffset: {
			width: 0,
			height: 6
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 3,
		height: 300
	},
	cardImage: {
		height: 180,
		width: "100%",
		resizeMode: 'stretch',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	cardBody: {
		paddingTop: 15,
		paddingLeft: 15,
		paddingRight: 10,
		paddingBottom: 30,
	},
	firstInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	attractionName: {
		fontSize: 18,
	},
	reward: {
		flexDirection: "row",
		alignItems: "center",
	},
	coinIcon: {
		width: 24,
		height: 24
	}
});
