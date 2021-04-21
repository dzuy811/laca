import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import FormUserProfile from "../components/FormUserProfile";
import { RadioButton } from "react-native-paper";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "react-native-elements";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const user_avatar = require("../assets/user_avatar.jpg");

function UserProfile(props: any) {
	const user_info = {
		phoneNumber: "0707318155",
		name: "Nguyen Ngoc Dang Hung",
		gender: "F",
	};

	let regEx = /^\s*([A-Za-z]{1,}([-']| ))+[A-Za-z]+?\s*$/;

	const [user, setUser] = useState<any>(null);
	const phoneNumber = user_info.phoneNumber;
	const [name, setName] = useState<string>(user_info.name);
	const [gender, setGender] = useState<string>(user_info.gender);
	const [checkValidation, setValidation] = useState<boolean>(false);
	const [checkValidationName, setValidationName] = useState<boolean>(false);
	const [checkValidationGender, setValidationGender] = useState<boolean>(false);

	const handleNameChange = (newText: string) => {
		setName(newText);
		// Check if the new name is the old name or not
		if (newText.trimEnd() == user_info.name) setValidationName(false);
		// Validate the new name
		else setValidationName(regEx.test(newText) ? true : false);
		confirm();
	};

	function confirm() {
		if(checkValidationName || checkValidationGender)
			setValidation(true);
		if(checkValidationName == false && checkValidationGender == false)
			setValidation(false);
	}

	function checkGender() {
		console.log(gender != user_info.gender);
		if(gender != user_info.gender)
			setValidationGender(true);
		else
			setValidationGender(false);
		confirm();
	}

	const signOut = () => {
		firebase.auth().signOut();
	};

	const bootstrap = () => {
		firebase.auth().onAuthStateChanged((_user) => {
			if (_user) {
				setUser(_user);
			}
		});
	};

	useEffect(() => {
		bootstrap();
	}, []);

	useEffect(() => {
		console.log(gender)
		checkGender();
	}, [gender]);

	const styles = StyleSheet.create({
		container: {
			justifyContent: "center",
			alignItems: "center",
		},
		infoContainer: {
			justifyContent: "space-around",
			alignItems: "flex-end",
		},
		containerForm: {
			width: "100%",
			paddingBottom: 20,
		},
		containerNavigator: {
			height: 90,
			width: "100%",
			backgroundColor: "#4B8FD2",
		},
		textAvatar: {
			alignSelf: "center",
			marginTop: 10,
			fontWeight: "bold",
			color: "#8DBAE2",
			fontSize: 15,
		},
		image: {
			height: 140,
			width: 140,
			backgroundColor: "#FFF",
			borderRadius: 100,
			marginTop: 30,
		},
		genderContainer: {
			paddingTop: 5,
			marginTop: 24,
			marginLeft: 32,
			marginRight: 32,
		},
		signOutButton: {
			justifyContent: "center",
			alignItems: "center",
			position: "absolute",
			height: 40,
			left: 0,
			top: windowHeight - 350,
			width: windowWidth,
		},
		textSignOut: {
			fontSize: 18,
			color: "#8DBAE2",
			opacity: 0.7,
		},
		textUpdate: {
			color: checkValidation ? "#FFF" : "#BDBDBD",
			textAlign: "right",
			fontSize: 18,
			marginRight: 15,
			fontWeight: checkValidation ? "bold" : "normal",
		},
	});

	return (
		<View>
			{/* Navigation */}
			<Header
				leftComponent={
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>Edit Profile</Text>}
				rightComponent={
					<TouchableOpacity
						activeOpacity={checkValidation ? 0.4 : 1}
						onPress={() => {
							if (checkValidation) alert("Seulgi");
						}}
					>
						<Text style={styles.textUpdate}>Update</Text>
					</TouchableOpacity>
				}
			/>

			{/* Image */}
			<View style={styles.container}>
				<Image style={styles.image} source={user_avatar} resizeMode={"cover"} />
				<View style={styles.infoContainer}>
					<TouchableOpacity onPress={() => alert("Seulgi")}>
						<Text style={styles.textAvatar}> Change avatar</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Form */}
			<View>
				<FormUserProfile editable={false} label="Phone number" value={phoneNumber} />
				<FormUserProfile label="Name" value={name} onChangeHandler={handleNameChange} />
				<View style={styles.genderContainer}>
					<Text
						style={{
							height: 26,
							fontSize: 14,
							color: "#BDBDBD",
						}}
					>
						Gender
					</Text>
					<View style={{ flexDirection: "row", width: "100%" }}>
						<View style={{ flexDirection: "row", marginRight: 30 }}>
							<RadioButton
								value="M"
								color="#4B8FD2"
								status={gender === "M" ? "checked" : "unchecked"}
								onPress={() => {
									console.log(">>>>>>>")
									setGender("M");
									// checkGender();
								}
									}
							/>
							<Text style={{ fontSize: 16, paddingTop: 7 }}>Male</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<RadioButton
								value="F"
								color="#4B8FD2"
								status={gender === "F" ? "checked" : "unchecked"}
								onPress={() => {
									console.log(">>>>>>>")
									setGender("F");
									// checkGender();
								}}
							/>
							<Text style={{ fontSize: 16, paddingTop: 7 }}>Female</Text>
						</View>
					</View>
				</View>

				{/* Sign out */}
				<View style={styles.signOutButton}>
					<TouchableOpacity onPress={signOut}>
						<Text style={styles.textSignOut}> Sign out</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default UserProfile;
