import React, { FC } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, PhoneAuth } from "../screens";
import DescriptionTab from "../screens/DescriptionTab";
import AttractionMap from "../screens/AttractionMap";
const { Navigator, Screen } = createStackNavigator();

const AuthStack: FC = () => {
	return (
		<Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Screen name="login" component={Login} />
			<Screen name="phoneAuth" component={PhoneAuth} />
		</Navigator>
	);
};

export default AuthStack;
