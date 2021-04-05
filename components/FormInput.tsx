import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Animated, Dimensions } from "react-native";

// define interface props
interface Props {
	label: string;
	value: string;
	isSecured?: boolean;
	[key: string]: any;
}

// limited usage only for un-typed object
interface AnyObject {
	[key: string]: any;
}

const FormInput: React.FC<Props> = ({ label, value, isSecured, onChangeHandler }) => {
	const [isFocused, setIsFocused] = useState<boolean>(false);
	// var width = Dimensions.get("window").width; //full width
	// var height = Dimensions.get("window").height; //full height
	var animatedIsFocused = new Animated.Value(value === "" ? 0 : 1);

	// STYLES defined
	const styles = StyleSheet.create({
		container: {
			paddingTop: 18,
			marginTop: 24,
			marginLeft: 32,
			marginRight: 32,
		},
		input: {
			height: 26,
			fontSize: 18,
			color: !isFocused ? "#FAF7EF" : "#fff",
			borderBottomWidth: 1,
			borderBottomColor: !isFocused ? "#FAF7EF" : "#fff",
			opacity: !isFocused ? 0.5 : 1,
		},
	});

	// Label style definition for animated object
	const LabelStyle = {
		position: "absolute",
		left: 0,
		top: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [18, 0],
		}),
		fontSize: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [16, 12],
		}),
		color: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: ["#FAF7EF", "#fff"],
		}),
		opacity: !isFocused ? 0.5 : 1,
		// color: !isFocused ? "#FAF7EF" : "#fff",
	} as AnyObject;

	// METHODS defined
	const handleFocus = () => {
		setIsFocused(true);
	};
	const handleBlur = () => {
		setIsFocused(false);
	};

	// HOOKS defined
	useEffect(() => {
		Animated.timing(animatedIsFocused, {
			toValue: isFocused || value !== "" ? 1 : 0,
			duration: 200,
			useNativeDriver: false, // add This line to make sure it works
		}).start();
	});

	return (
		<View style={styles.container}>
			<Animated.Text style={LabelStyle}>{label}</Animated.Text>
			<TextInput
				value={value}
				style={styles.input}
				onFocus={handleFocus}
				onBlur={handleBlur}
				blurOnSubmit
				onChangeText={onChangeHandler}
				secureTextEntry={isSecured}
			></TextInput>
		</View>
	);
};

export default FormInput;