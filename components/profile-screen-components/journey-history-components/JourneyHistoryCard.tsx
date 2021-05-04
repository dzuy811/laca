import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import moment from "moment";

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
			<View style={[{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }]}>
				<Text style={style.addressText}>(??) km</Text>
				<Text style={[style.addressText, { marginLeft: 5, marginRight: 5 }]}>-</Text>
				<Text style={style.addressText}>69 Đồng Khởi</Text>
			</View>
			<View style={[{ marginTop: 14, flexDirection: "row" }]}>
				<FontAwesome5 style={{ marginRight: 2 }} name="coins" size={24} color="#E2D0A2" />
				<Text style={{ marginLeft: 2, fontSize: 14, color: "#E2D0A2" }}>{attraction.reward}</Text>
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
