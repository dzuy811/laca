import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import AttractionMap from "../screens/AttractionMap";
import DescriptionTab from "../screens/DescriptionTab";
import MapScreen from "../screens/MapScreen";

const Stack = createStackNavigator();

const AttractionNavigator = () => {
	return (
		<Stack.Navigator headerMode="none">
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Description" component={DescriptionTab} />
			<Stack.Screen name="Map" component={AttractionMap} />
			<Stack.Screen name="MapTile" component={MapScreen} />
		</Stack.Navigator>
	);
};

export default AttractionNavigator;
