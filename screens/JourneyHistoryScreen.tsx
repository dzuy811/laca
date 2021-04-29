import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import JourneyHistoryCard from "../components/profile-screen-components/journey-history-components/JourneyHistoryCard";
import { storeData, getData } from "../constants/utility";

const JourneyHistoryScreen: React.FC<any> = (props) => {
	const [histories, setHistories] = useState<any>();

	// Dynamically fetch histories based on user's id
	const fetchHistoryByUserID = async () => {
		const userID = await getData("id");
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/${userID}/histories}`)
			.then((res) => res.json())
			.then((json) => {
				setHistories(json);
			});
	};

	// Fetch on component's mount
	useEffect(() => {
		fetchHistoryByUserID();
	}, []);

	// Log histories
	useEffect(() => {
		if (histories != null && typeof histories !== "undefined") {
			console.log(histories);
		}
	}, [histories]);

	return (
		<View>
			<Header
				leftComponent={
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>Journey History</Text>}
			/>
			{/* Journey History card section */}
			<View style={{ marginTop: 20 }}>
				<View style={{ paddingLeft: 25 }}>
					<Text style={{ fontSize: 16, color: "#bdbdbd", fontWeight: "700" }}>
						Completed journey
					</Text>
				</View>
				<View style={{ marginTop: 16 }}>
					{/* Card Component */}
					<JourneyHistoryCard />
				</View>
			</View>
		</View>
	);
};

const style = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: "#4B8FD2",
		height: 100,
		alignItems: "center",
	},
});

export default JourneyHistoryScreen;
