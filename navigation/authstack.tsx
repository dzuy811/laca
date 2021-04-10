import React, { FC } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, SignUp, MapScreen } from "../screens";
const { Navigator, Screen } = createStackNavigator();

const AuthStack: FC = () => {
	return (
		<Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName="maptile"
		>
			<Screen name="maptile" component={MapScreen} />
			<Screen name="login" component={Login} />
			<Screen name="signUp" component={SignUp} />
		</Navigator>
	);
};

export default AuthStack;
