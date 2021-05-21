import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./constants/firebase";
import MainNav from "./navigation/mainNav";
import VoucherShop from "./screens/VoucherShop";
import HomeScreen from "./screens/HomeScreen";
import AttractionMap from "./screens/AttractionMap";
import AttractionNavigator from "./navigator/AttractionNavigator";
import AppContext from './components/AppContext'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


const Tab = createBottomTabNavigator();

let barStyle: string = "light-content";

export default function App() {
	// surpress warnings for virtualizedLists
	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
		LogBox.ignoreLogs(["Setting a timer"]);
	}, []);

	const [onJourney, setOnJourney] = useState(false)
	const [currentJourneyID, setCurrentJourneyID] = useState("")
	const [currentAttractionID, setCurrentAttractionID] = useState(null);

	const userGlobalData = {
		onJourney: onJourney,
		setOnJourney,
		currentJourneyID: currentJourneyID,
		setCurrentJourneyID,
		currentAttractionID: currentAttractionID,
		setCurrentAttractionID
	}

	return (
		<SafeAreaProvider>
			<StatusBar
			style="light"
			backgroundColor="#4B8FD2"
			/>
			{/* <MainNav /> */}
			{/* <ReviewScreen/> */}
			<AppContext.Provider value={userGlobalData}>
				<MainNav />
			</AppContext.Provider>
			{/* <VoucherShop /> */}

		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	containerLogin: {
		flex: 1,
		backgroundColor: "#4B8FD2",
	},
});
