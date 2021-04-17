import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import MapTile from "../components/MapTile";


type props = {
	route: any
}

const MapScreen: React.FC<props> = ({route}) => {
	return <MapTile attractionCoordinate={route.params}  />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
	},
});

export default MapScreen;
