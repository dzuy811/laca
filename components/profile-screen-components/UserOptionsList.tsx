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
			<View style={styles.container}>
				<UserOption navigation={navigation} color="#f4a9a8" icon={require('../../assets/sneakers.png')} name="My journeys" />
			</View>
			<View style={styles.container}>
				<UserOption navigation={navigation} color="#94d0cc" icon={require('../../assets/laugh.png')} name="Friends" />

			</View>
			<View style={styles.container}>
				<UserOption navigation={navigation} color="#ffd56b" icon={require('../../assets/coupon.png')} name="My vouchers" />

			</View>
			<View style={styles.container}>
				<UserOption navigation={navigation} color="#aa2ee6" icon={require('../../assets/help.png')} name="Help" />

			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 5
	}
})

export default UserOptionsList;
