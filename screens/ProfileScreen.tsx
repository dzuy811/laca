import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ProfileHeader from "../components/profile-screen-components/ProfileHeader";
import UserOptionsList from "../components/profile-screen-components/UserOptionsList";
import firebase from "firebase";

const ProfileScreen = ({ navigation }: any) => {
	const [user, setUser] = useState<any>(firebase.auth().currentUser);
	const [data, setData] = useState<any>({});

	useEffect(() => {
		async function getUserInfo() {
			// Get user's information from collection
			firebase
				.firestore()
				.collection("users")
				.doc(user.uid)
				.get()
				.then((user_info: any) => {
					let dataInfo = user_info.data();
					let address: string[] = [];
					if (dataInfo.address == null && typeof dataInfo.address == "undefined") {
						address[0] = "";
						address[1] = "";
						dataInfo.address = address;
					}
					setData(dataInfo);
				})
				.catch((error) => {
					console.log("error:", error);
				});
		}
		getUserInfo();
	}, []);

	return (
		<View style={{ backgroundColor: "#fff", flex: 1 }}>
			<View>
				<ProfileHeader setData={setData} data={data} navigation={navigation} />
			</View>
			<View style={{ marginTop: 10, paddingHorizontal: 6 }}>
				<UserOptionsList navigation={navigation} />
			</View>
		</View>
	);
};

export default ProfileScreen;
