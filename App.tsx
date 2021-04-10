import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import MainNav from "./navigation/mainNav";

export default function App() {
	return (
		<View style={styles.container}>
			<StatusBar />
			<MainNav />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#4B8FD2",
	},
});
