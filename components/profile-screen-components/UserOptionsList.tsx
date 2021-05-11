import React from "react";

import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import UserOption from "./UserOption";

import { RootStackParamList } from "../../screens/ProfileStackParams";

import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

interface Props {
	navigation: StackScreenProps<RootStackParamList>;
}

const UserOptionsList: React.FC<Props> = ({ navigation }: any) => {
	return (
		<View>
			<UserOption navigation={navigation} name="Journey history" />
			<UserOption navigation={navigation} name="My friends" />
			<UserOption navigation={navigation} name="Favorite attraction" />
			<UserOption navigation={navigation} name="Help" />
		</View>
	);
};

export default UserOptionsList;
