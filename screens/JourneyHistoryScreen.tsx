import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	FlatList,
	ActivityIndicator
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import JourneyHistoryCard from "../components/profile-screen-components/journey-history-components/JourneyHistoryCard";
import { getData } from "../constants/utility";

const JourneyHistoryScreen: React.FC<any> = (props) => {
	const [histories, setHistories] = useState<any>();
	const [userJourneyCount, setUserJourneyCount] = useState<number>();
	const [loading, setLoading] = useState(true)

	// Dynamically fetch histories based on user's id
	const fetchHistoryByUserID = async () => {
		let mounted = true;
		try {
			const userID = await getData("id");
			fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/${userID}/histories`)
				.then((res) => res.json())
				.then((json) => {
					if (mounted) {
						setHistories(json);
					}
				});
		} catch (error) {
			console.log(error);
		}
		return () => {
			mounted = false
		}
	};

	const fetchUserJourneyCount = async () => {
		try {
			const userID = await getData("id");
			fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/${userID}`)
				.then((res) => res.json())
				.then((json) => {
					setUserJourneyCount(json.journeyCount);
				});
		} catch (error) {
			console.log(error);
		}
	};
	//Render item for FlatList
	const renderHistory = ({ item, index }: any) => {
		return (
			<View style={{ marginTop: 16 }}>
				{/* Card Component */}
				<JourneyHistoryCard key={index} data={item} />
			</View>
		);
	};

	// Fetch on component's mount
	useEffect(() => {
		fetchUserJourneyCount().then(res => {
			fetchHistoryByUserID().then(res => setLoading(false));
		});
		return () => {
			// fetchHistoryByUserID();
			// fetchUserJourneyCount();
		}
		
	}, []);

	// Log histories
	useEffect(() => {
		if (histories != null && typeof histories !== "undefined") {
			// console.log(histories);
		}
	}, [histories]);

	return (
		<View style={{height: '100%'}}>
			<Header
				leftComponent={
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>Journey History</Text>}
			/>
			{/* Journey History card section */}
			{loading ?
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
					<ActivityIndicator size="large" color="#2966A3" />
				</View>
				:

				<View style={{ marginTop: 20 }}>
					<View style={{ paddingLeft: 25 }}>
						{userJourneyCount ? (
							<>
								<Text style={{ fontSize: 16, color: "#bdbdbd", fontWeight: "700" }}>
									Completed journey ({userJourneyCount})
							</Text>
							</>
						) : (
							<>
								<Text style={{ fontSize: 16, color: "#bdbdbd", fontWeight: "700" }}>
									Completed journey (N/A)
							</Text>
							</>
						)}
					</View>
					<ScrollView>
					{histories ? (
						<FlatList data={histories} renderItem={renderHistory} />
					) : (
						<>
							{userJourneyCount == 0 ? (
								<View style={{ marginLeft: 24 }}>
									<Text>There aren't any histories yet!</Text>
								</View>
							) : (
								<View style={{ marginLeft: 2 }}>
									<ActivityIndicator size="large" color="#2966A3" />
								</View>
							)}
						</>
					)}
					</ScrollView>
				</View>
			}

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
