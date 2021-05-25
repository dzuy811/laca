import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from "react-native";
import FormUserProfile from "../components/FormUserProfile";
import { RadioButton } from "react-native-paper";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';
import AppContext from '../components/AppContext'
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const default_user_avatar = require("../assets/default_avatar.jpg");
const location = require('../components/location.json');

type UserProfile = {
    navigation?: any;
    route: any;
}

const UserProfile = ({route, navigation}: UserProfile) => {
	
	const { data, setData } = route.params;
	const [user, setUser] = useState<any>();
	const [provinces, setProvinces] = useState<any>(data.address[0]);
	const [districts, setDistricts] = useState<any>(data.address[1]);
	const [phoneNumber] = useState<string>(data.phoneNumber != "" ? "0" + data.phoneNumber.substring(3) : "");
	const [name, setName] = useState<string>(data.name);
	const [gender, setGender] = useState<string>(data.gender);
	const [urlAvatar, setUrlAvatar] = useState<string>(data.urlAvatar);
	const [checkValidation, setValidation] = useState<boolean>(false);
	const [checkValidationGender, setValidationGender] = useState<boolean>(false);
	const [addressStatus, setAddressStatus] = useState<number>(-1);
	const userGlobalData = useContext(AppContext)

	// Generate the data for Vietnam's Administrative Division
	let province = [];

	// Get the Provinces
	for (let i = 0; i < location.length; i++) {
		let objPro = {
			label: location[i].Name,
			value: location[i].Name,
		}
		province.push(objPro);
	}

	// Take the index of Province in the array
	function takeAddressIndex(address: string):number {
		for (let i = 0; i < location.length; i++) {
			if(location[i].Name == address) return i;
		}
		return 0;
	}

	// Get the District array based on the Province index
	function getDistrictArray(index:number):any {
		let arr: { label: string, value: string}[] = [];
		for(let i = 0; i < location[index].Districts.length; i++) {
			let objDis = {
				label: location[index].Districts[i].Name,
				value: location[index].Districts[i].Name
			}
			arr.push(objDis);
		}
		return arr;
	}

	// Regular Expression for Name Validation
	let regEx = /^\s*([A-Za-z]{1,}([-']| ))+[A-Za-z]+?\s*$/;

	const handleNameChange = (newText: string) => {
		setName(newText);
		// Check if the new name is the old name or not
		if (newText.trimEnd() == data.name) {
			if(checkValidationGender) setValidation(true);	
			else setValidation(false);
			
		}
		// Validate the new name
		else {
			if(true) setValidation(regEx.test(newText) ? true : false)
		}
	};

	function checkGender() {
		console.log(gender != data.gender);
		if(gender != data.gender)
			setValidationGender(true);
		else
			setValidationGender(false);
	}

	useEffect(() => {
		// console.log(gender)
		checkGender();
	}, [gender]);

	// Sign out function
	const signOut = () => {
		firebase.auth().signOut();
		userGlobalData.setUserInfo(null);
		navigation.navigate('home')
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

	// Give permission to use device library
	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
  	}, []);

	// Get image from library function
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.cancelled) await uploadImage(result);
	};

	// Upload image to storage
	const uploadImage = async (image: any) => {
		const { uri } = image;
		const response = await fetch(uri);
		const blob = await response.blob();
		const filename = "avatars/";
		const uploadUri = user.uid;

		var ref = firebase.storage().ref(filename).child(uploadUri);
		return ref.put(blob).then(() => {
  			console.log('Uploaded a blob or file!');
			ref.getDownloadURL().then((url) => {
				setUrlAvatar(url);
				setValidation(true);
  			})
		})
  		.catch((e: any) => console.log('uploading image error => ', e));
		};

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
		progressBarContainer: {
    		marginTop: 20
  		},
		dropDownListContainer: {
			backgroundColor: '#fafafa',
			width: windowWidth - 70, 
		}
	});

	return (
		<View>
			{/* Navigation */}
			<Header
				leftComponent={
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>Edit Profile</Text>}
				rightComponent={
					<TouchableOpacity
						activeOpacity={checkValidation ? 0.4 : 1}
						// Update the validation
						onPress={() => {
							if (checkValidation) {
								const new_info = {
									phoneNumber: "+84" + phoneNumber.substring(1),
									name: name,
									gender: gender,
									urlAvatar: urlAvatar,
									address: [
										provinces, 
										districts
									]
								};
								firebase.firestore().collection("users").doc(user?.uid).set(new_info, { merge: true });
								setData(new_info);
								setValidation(false);
							};
						}}
					>
						<Text style={styles.textUpdate}>Update</Text>
					</TouchableOpacity>
				}
			/>

			{/* Image */}
			<View style={styles.container}>
				<Image 
					style={styles.image} 
					// Display the default image if not image found
					source={urlAvatar != "" ? ({uri: urlAvatar}) : default_user_avatar} 
					resizeMode={"cover"} 
				/>
				<View style={styles.infoContainer}>
					<TouchableOpacity onPress={pickImage}>
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
					>Gender
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
								}}
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
								}}
							/>
							<Text style={{ fontSize: 16, paddingTop: 7 }}>Female</Text>
						</View>
					</View>
				</View>

				{/* Dropdown List for location */}
				<View style={styles.genderContainer}>
					<Text
						style={{
							height: 26,
							fontSize: 14,
							color: "#BDBDBD",
						}}
					>
						Address
					</Text>
					<View style={{paddingTop:10}} />
					{/* Provinces */}
					<DropDownPicker
						style={styles.dropDownListContainer}
						items={province}
						containerStyle={{height: 40}}
						itemStyle={{
							justifyContent: 'flex-start'
						}}
						dropDownStyle={{backgroundColor: '#fafafa', width: windowWidth - 70}}
						placeholder={provinces != "" ? provinces : "City/Province"}
						onChangeItem={
							item => {
								setProvinces(item.value);
								setAddressStatus(takeAddressIndex(item.value));
								setValidation(false);
								setDistricts("");
							}
						}
					/>

					<View style={{paddingTop:10}} />
					{/* Districts */}
					<DropDownPicker
						style={styles.dropDownListContainer}
						disabled={addressStatus == -1 && districts == "" ? true : false}
						items={getDistrictArray(addressStatus == -1 && provinces == "" ? 0 : takeAddressIndex(provinces))}
						containerStyle={{height: 40}}
						itemStyle={{
							justifyContent: 'flex-start'
						}}
						dropDownStyle={{backgroundColor: '#fafafa', width: windowWidth - 70}}
						placeholder={districts == "" ? "Ward/District" : districts}
						onChangeItem={item => {
							setDistricts(item.value)
							setValidation(true);
						}}
					/>
				</View>
				{/* Announcement for choosing the Ward/District */}
				{districts == "" && provinces != "" ? (
					<View style={styles.container}>
						<Text style={{color: "red"}}>Choose the Ward/District</Text>
					</View>
				):
				(
					<>
					</>
				)}

				{/* Sign out */}
				<View style={styles.signOutButton}>
					<TouchableOpacity onPress={
						signOut
					}>
						<Text style={styles.textSignOut}> Sign out</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default UserProfile;