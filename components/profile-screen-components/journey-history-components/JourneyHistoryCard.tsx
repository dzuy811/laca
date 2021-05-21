import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import moment from "moment";
import * as Location from 'expo-location'

interface JourneyCardProps {
	data: HistoryData;
}

interface HistoryData {
	id: string;
	createdAt: {
		_seconds: number;
		_nanoseconds: number;
	};
	user: any;
	attraction: any;
}

const JourneyHistoryCard = ({ data }: JourneyCardProps) => {
	const { id, createdAt, user, attraction } = data;
	const timestamp = new Date(createdAt._seconds * 1000);
	let address: string;
	Location.reverseGeocodeAsync({latitude: attraction.geoPoint._latitude, longitude: attraction.geoPoint._longitude})
	.then(res => { 
		console.log();
		
	})


	// console.log('attraction: ', location);
	

	const formatDateString = (timestamp: Date): string => {
		moment.locale("en");
		return moment(timestamp).format("LL");
	};
	return (
		<View style={style.cardContainer}>
			<View style={{ marginTop: 6 }}>
				<Text style={style.journeyDate}>{formatDateString(timestamp)}</Text>
			</View>
			<View style={{ marginTop: 3 }}>
				<Text style={{ fontSize: 18 }}>{attraction.name}</Text>
			</View>
			<View style={[{ marginTop: 14, flexDirection: "row", alignItems: 'center' }]}>
				<Image 
				source={require("../../../assets/dollar.png")}
				/>
				<Text style={{ marginLeft: 4, fontSize: 14, color: "#E2D0A2" }}>{attraction.reward}</Text>
			</View>
		</View>
	);
};

export default JourneyHistoryCard;

const style = StyleSheet.create({
	cardContainer: {
		backgroundColor: "#fff",
		paddingTop: 12,
		paddingBottom: 20,
		paddingLeft: 25,
		borderBottomColor: "#BED8EE",
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderTopColor: "#BED8EE",
	},

	journeyDate: {
		fontSize: 12,
		fontWeight: "300",
	},
	addressText: {
		fontSize: 14,
		color: "#bdbdbd",
	},
});
