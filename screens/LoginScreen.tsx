import React, { useState } from "react";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import FormInput from "../components/FormInput";

const LoginScreen: React.FC = () => {
	// States defined
	const [textValue, setTextValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");

	// Styles defined
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			width: "100%",
		},
		input: {
			height: 26,
			fontSize: 20,
			color: "#000",
			borderBottomWidth: 1,
			borderBottomColor: "#555",
		},
	});

	// Methods defined
	const handleTextChange = (newText: string) => {
		setTextValue(newText);
	};

	const handlePasswordChange = (newPassword: string) => {
		setPasswordValue(newPassword);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS == "ios" ? "padding" : "height"}
		>
			<FormInput label="Username" value={textValue} onChangeHandler={handleTextChange} />
			<FormInput
				isSecured={true}
				label="Password"
				value={passwordValue}
				onChangeHandler={handlePasswordChange}
			/>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
