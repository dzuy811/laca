import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./constants/firebase";
import MainNav from "./navigation/mainNav";

import HomeScreen from "./screens/HomeScreen";
import AttractionMap from "./screens/AttractionMap";
import AttractionNavigator from "./navigator/AttractionNavigator";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

let barStyle: string = "light-content";

export default function App() {
	// surpress warnings for virtualizedLists
	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
		LogBox.ignoreLogs(["Setting a timer"]);
	}, []);

	return (
		<SafeAreaProvider>
			<StatusBar
			style="light"
			backgroundColor="#4B8FD2"
			/>
			<MainNav />
			{/* <ReviewScreen/> */}

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
