import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import MapTile from "../components/MapTile";

const MapScreen: React.FC = () => {
	return <MapTile />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
	},
});

export default MapScreen;
