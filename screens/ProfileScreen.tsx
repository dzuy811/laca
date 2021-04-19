import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ProfileHeader from "../components/profile-screen-components/ProfileHeader";
import UserOptionsList from "../components/profile-screen-components/UserOptionsList";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./ProfileStackParams";

type ProfileScreenNavigationProp = StackScreenProps<RootStackParamList>;

const ProfileScreen = ({ route, navigation }: any) => {
	return (
		<View>
			<View>
				<ProfileHeader navigation={navigation} />
			</View>
			<View style={{ marginTop: 50 }}>
				<UserOptionsList navigation={navigation} />
			</View>
		</View>
	);
};

export default ProfileScreen;
