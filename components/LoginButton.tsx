import React, { FC } from "react";
import { Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
	title: string;
	onPress: () => void;
}

function changeColor(title: string) {
	if (title == "LOGIN") {
		return { pressed: true, backgroundColor: "red", backgroundColor2: "black" };
	}
}

const LoginButton: FC<Props> = (props) => {
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			style={props.title == "LOGIN" ? styles.containerLogin : styles.containerSignUp}
			onPress={props.onPress}
		>
			<Text style={props.title == "LOGIN" ? styles.textLogin : styles.textSignUp}>
				{props.title}
			</Text>
		</TouchableOpacity>
	);
};

export default LoginButton;

const styles = StyleSheet.create({
	containerSignUp: {
		width: 300,
		padding: 20,
		backgroundColor: "#DFEBF7",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#fff",
		alignItems: "center",
		marginBottom: 10,
	},
	containerLogin: {
		width: 300,
		padding: 20,
		backgroundColor: "#4B8FD2",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#fff",
		alignItems: "center",
		marginBottom: 20,
	},
	textLogin: {
		color: "#FFF",
	},
	textSignUp: {
		color: "#8DBAE2",
	},
});
