import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./constants/firebase";
import MainNav from "./navigation/mainNav";

import HomeScreen from "./screens/HomeScreen";
import AttractionMap from "./screens/AttractionMap";
import AttractionNavigator from "./navigator/AttractionNavigator";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AttractionList from "./components/AttractionList";
import AttractionCard from "./components/AttractionCard";

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<View style={styles.containerLogin}>
			<StatusBar />
			<MainNav />
		</View>
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
