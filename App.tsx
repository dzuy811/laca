import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
export default function App() {
	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<LoginScreen />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#4B8FD2",
		alignItems: "center",
		justifyContent: "center",
	},
});
