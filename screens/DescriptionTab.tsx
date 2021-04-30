import React, { useEffect, useRef, useState } from "react";
// import React from "react";
import { View, Text, StyleSheet, Image, Alert, FlatList, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UserLogo from "../assets/fb_logo.png";

import { LoginButton } from "../components";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimatedHeader from "../components/AnimatedHeader";

type IItem = {
	item: typeImageData;
	index: number;
};
type Props = {
	route: {
		params: {
			latitude: number;
			longitude: number;
			description: string;
			name: string;
			id : string;
		};
	};
	navigation: any;
};

type typeImageData = { id: string; source: string };

type DescriptionType = { id: string; name: string; avatar: string; content: string };
type dataDescrip = {
	item: DescriptionType;
};

interface uniqueReviews  {
	content:string;
	rating : number;
	uid : string;
	aid : string;
	likeCount : number; 
	timeCreated : any;
}

interface reviewList {
	[index : number ] : uniqueReviews
}



type userInfor = {
	phoneNumber : string,
	name : string,
	username : string,
	userAvatar:any,

}


// const [dataFeteched,setDataFeteched] = useState([])

// useEffect(()=>{
//     fetch("")
// })



const Data = [
	{
		id: "01",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "02",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "03",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "04",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "05",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
];



type ListData = DescriptionType[]


const descriptionData = [
	{
		id: "01",
		name: "Minh Nguyen",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
	{
		id: "02",
		name: "Hung Nguyen",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
	{
		id: "03",
		name: "Duy Vo",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
	{
		id: "04",
		name: "Dat Ngo",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
	{
		id: "05",
		name: "Data Science",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
	{
		id: "06",
		name: "Machine Learning",
		avatar: "../assets/user.jpg",
		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	},
];


const DescriptionTab = ({ route, navigation }: Props) => {
	const offset = useRef(new Animated.Value(0)).current;
	const { latitude, longitude, description, name, id } = route.params;
	const [data, setData] = useState<uniqueReviews[]>([]);

	// fetch list of reviews 

	useEffect(() => {
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/attractions/${id}`)
		.then((response) => response.json())
		.then((json) => {
            setData(json)
			console.log("==============================")
            console.log(json) // For debugging. Check if the effect is called multiple times or not
        })
		.catch((err) => console.error(err))
	},[])

	let dataPoint = 0
	let dataCombine = [] as ListData

	data.forEach((review) => {
		let ThisData = {} as DescriptionType  
		ThisData.id = dataPoint.toString()
		dataPoint ++
		ThisData.content = review.content
		ThisData.avatar = "../assets/user_avatar.jpg"
		ThisData.name = "Dat"
		dataCombine.push(ThisData)
	})

	useEffect(()=>{
		console.log("data below")
		console.log(dataCombine)
	})

	// console.log(data)


	// })

	// Render list of descriptions for Flatlist
	const renderDescription = ({ item }: dataDescrip) => (
		<View>
			<View style={{ flexDirection: "row" }}>
				<Image source={UserLogo} style={styles.profileImage} />
				<Text style={styles.profileName}>{item.name}</Text>
			</View>
			<View style={styles.DescriptionBox}>
				<Text style={{ fontSize: 12 }}>{item.content}</Text>
			</View>
		</View>
	);

	// Render list of images for Flatlist
	const renderImage = ({ item, index }: IItem) => {
		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
	};

	// Button press handler
	const onPressThing = () => {
		Alert.alert("Alert Title", "My Alert Msg", [
			{
				text: "Ask me later",
				onPress: () => console.log("Ask me later pressed"),
			},
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{ text: "OK", onPress: () => console.log("OK Pressed") },
		]);
	};

	return (
		<>
			<View style={{ flex: 1 }}>
				<AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} />

				<View style={{ flex: 1, backgroundColor: "white", paddingLeft: "5%", paddingRight: "5%" }}>
					<View>
						<Animated.ScrollView
							style={{ backgroundColor: "white" }}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{}}
							scrollEventThrottle={16}
							onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
								useNativeDriver: false,
							})}
						>
							<Text style={styles.DescriptionTitle}>Description</Text>
							<Text style={styles.DescriptionBox}>{description}</Text>
							<Text style={styles.DescriptionTitle}>Gallery</Text>
							<View style={{ marginLeft: "10%" }}>
								<FlatList
									data={Data}
									renderItem={renderImage}
									keyExtractor={(item) => item.id}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
									style={styles.flatList}
								/>
							</View>
							<View style={{ paddingBottom: 100 }}>
								<Text style={styles.DescriptionTitle}>Reviews</Text>
								<FlatList
									data={dataCombine}
									renderItem={renderDescription}
									keyExtractor={(item) => item.id}
								></FlatList>
							</View>
						</Animated.ScrollView>
					</View>
				</View>
				<LinearGradient
					colors={["rgba(255,255,355,0.02)", "rgba(255,255,355,1)"]}
					style={{
						position: "absolute",
						alignItems: "center",
						marginTop: "0%",
						left: 0,
						right: 0,
						bottom: 0,
						marginBottom: 0,
						zIndex: 2,
					}}
				>					<LoginButton
						title="Take the journey"
						onPress={() => {
							navigation.navigate("Journey Map", {
								latitude: latitude,
								longitude: longitude,
							});
						}}
						color="#4B8FD2"
						textColor="#E2D0A2"
					/>
				</LinearGradient>
			</View>
		</>
	);
};



const styles = StyleSheet.create({
	header: {
		/* aero/dark */
		position: "relative",
		height: 200,
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: "#4B8FD2",
		borderBottomRightRadius: 30,
		borderBottomLeftRadius: 30,
	},
	nameLocation: {
		textAlign: "center",
		textAlignVertical: "bottom",
		paddingTop: "2%",
		marginBottom: "2%",
		lineHeight: 70,
		fontSize: 30,
	},
	DistancePlace: {
		textAlign: "center",
		textAlignVertical: "center",
		paddingTop: "2%",
		fontSize: 10,
		paddingBottom: "5%",
	},
	buttonBack: {
		paddingTop: "2%",
		marginRight: 120,
		marginTop: "3%",
	},
	buttonInfo: {
		paddingTop: "2%",
		marginLeft: 120,
		marginTop: "3%",
	},

	DescriptionTitle: {
		marginTop: "4%",
		fontSize: 25,
		marginLeft: "10%",
		color: "rgb(211,184,115)",
		paddingBottom: "2%",
	},
	DescriptionBox: {
		paddingBottom: "5%",
		paddingRight: "10%",
		paddingLeft: "10%",
		fontSize: 14,
		textAlign: "left",
	},
	imageStyle: {
		marginRight: 30,
		height: 220,
		width: 150,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	flatList: {
		height: 250,
		flexGrow: 0,
	},

	profileImage: {
		marginLeft: "8%",
		height: 40,
		width: 40,
		borderRadius: 40,
		overflow: "hidden",
	},
	profileName: {
		fontSize: 14,
		fontWeight: "400",
		paddingLeft: "2%",
		paddingTop: 10,
	},
});

export default DescriptionTab;

// import React, { useEffect, useRef, useState } from "react";
// // import React from "react";
// import { View, Text, StyleSheet, Image, Alert, FlatList, Animated } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import UserLogo from "../assets/fb_logo.png";

// import { LoginButton } from "../components";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import AnimatedHeader from "../components/AnimatedHeader";

// type IItem = {
// 	item: typeImageData;
// 	index: number;
// };
// type Props = {
// 	route: {
// 		params: {
// 			latitude: number;
// 			longitude: number;
// 			description: string;
// 			name: string;
// 		};
// 	};
// 	navigation: any;
// };

// const Data = [
// 	{
// 		id: "01",
// 		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
// 	},
// 	{
// 		id: "02",
// 		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
// 	},
// 	{
// 		id: "03",
// 		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
// 	},
// 	{
// 		id: "04",
// 		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
// 	},
// 	{
// 		id: "05",
// 		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
// 	},
// ];

// const descriptionData = [
// 	{
// 		id: "01",
// 		name: "Minh Nguyen",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// 	{
// 		id: "02",
// 		name: "Hung Nguyen",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// 	{
// 		id: "03",
// 		name: "Duy Vo",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// 	{
// 		id: "04",
// 		name: "Dat Ngo",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// 	{
// 		id: "05",
// 		name: "Data Science",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// 	{
// 		id: "06",
// 		name: "Machine Learning",
// 		avatar: "../assets/user.jpg",
// 		textComment: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
// 	},
// ];
// const DescriptionTab = ({ route, navigation }: Props) => {
// 	const offset = useRef(new Animated.Value(0)).current;
// 	const { latitude, longitude, description, name } = route.params;
// 	// useEffect(() => {
// 	// 	console.log(latitude, longitude);
// 	// }, [latitude, longitude]);

// 	// Render list of descriptions for Flatlist
// 	const renderDescription = ({ item }: dataDescrip) => (
// 		<View>
// 			<View style={{ flexDirection: "row" }}>
// 				<Image source={UserLogo} style={styles.profileImage} />
// 				<Text style={styles.profileName}>{item.name}</Text>
// 			</View>
// 			<View style={styles.DescriptionBox}>
// 				<Text style={{ fontSize: 12 }}>{item.textComment}</Text>
// 			</View>
// 		</View>
// 	);

// 	// Render list of images for Flatlist
// 	const renderImage = ({ item, index }: IItem) => {
// 		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
// 	};

// 	// Button press handler
// 	const onPressThing = () => {
// 		Alert.alert("Alert Title", "My Alert Msg", [
// 			{
// 				text: "Ask me later",
// 				onPress: () => console.log("Ask me later pressed"),
// 			},
// 			{
// 				text: "Cancel",
// 				onPress: () => console.log("Cancel Pressed"),
// 				style: "cancel",
// 			},
// 			{ text: "OK", onPress: () => console.log("OK Pressed") },
// 		]);
// 	};

// 	return (
// 		<>
// 			<View style={{ flex: 1 }}>
// 				<AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} />

// 				<View style={{ flex: 1, backgroundColor: "white", paddingLeft: "5%", paddingRight: "5%" }}>
// 					<View>
// 						<Animated.ScrollView
// 							style={{ backgroundColor: "white" }}
// 							showsVerticalScrollIndicator={false}
// 							contentContainerStyle={{}}
// 							scrollEventThrottle={16}
// 							onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
// 								useNativeDriver: false,
// 							})}
// 						>
// 							<Text style={styles.DescriptionTitle}>Description</Text>
// 							<Text style={styles.DescriptionBox}>{description}</Text>
// 							<Text style={styles.DescriptionTitle}>Gallery</Text>
// 							<View style={{ marginLeft: "10%" }}>
// 								<FlatList
// 									data={Data}
// 									renderItem={renderImage}
// 									keyExtractor={(item) => item.id}
// 									horizontal={true}
// 									showsHorizontalScrollIndicator={false}
// 									style={styles.flatList}
// 								/>
// 							</View>
// 							<View style={{ paddingBottom: 100 }}>
// 								<Text style={styles.DescriptionTitle}>Reviews</Text>
// 								<FlatList
// 									data={descriptionData}
// 									renderItem={renderDescription}
// 									keyExtractor={(item) => item.id}
// 								></FlatList>
// 							</View>
// 						</Animated.ScrollView>
// 					</View>
// 				</View>
// 				<LinearGradient
// 					colors={["rgba(255,255,355,0.8)", "rgba(255,255,355,1)"]}
// 					style={{
// 						position: "absolute",
// 						alignItems: "center",
//                         justifyContent: "center",
// 						left: 0,
// 						right: 0,
// 						bottom: 0,
// 						zIndex: 2,
                        
// 					}}
// 				>
//                     <View style={{paddingBottom: 15}}>
//                     <LoginButton
// 						title="Take the journey"
// 						onPress={() => {
// 							navigation.navigate("Journey Map", {
// 								latitude: "10.79103732064115", // Hard code for testing
// 								longitude: "106.6839277220927", // Hard code for testing
// 							});
// 						}}
// 						color="#4B8FD2"
// 						textColor="#E2D0A2"
// 					/>
//                     </View>
                    
					
// 				</LinearGradient>
// 			</View>
// 		</>
// 	);
// };

// type typeImageData = { id: string; source: string };

// type DescriptionType = { id: string; name: string; avatar: string; textComment: string };
// type dataDescrip = {
// 	item: DescriptionType;
// };

// const styles = StyleSheet.create({
// 	header: {
// 		/* aero/dark */
// 		position: "relative",
// 		height: 200,
// 		top: 0,
// 		left: 0,
// 		right: 0,
// 		zIndex: 10,
// 		backgroundColor: "#4B8FD2",
// 		borderBottomRightRadius: 30,
// 		borderBottomLeftRadius: 30,
// 	},
// 	nameLocation: {
// 		textAlign: "center",
// 		textAlignVertical: "bottom",
// 		paddingTop: "2%",
// 		marginBottom: "2%",
// 		lineHeight: 70,
// 		fontSize: 30,
// 	},
// 	DistancePlace: {
// 		textAlign: "center",
// 		textAlignVertical: "center",
// 		paddingTop: "2%",
// 		fontSize: 10,
// 		paddingBottom: "5%",
// 	},
// 	buttonBack: {
// 		paddingTop: "2%",
// 		marginRight: 120,
// 		marginTop: "3%",
// 	},
// 	buttonInfo: {
// 		paddingTop: "2%",
// 		marginLeft: 120,
// 		marginTop: "3%",
// 	},

// 	DescriptionTitle: {
// 		marginTop: "4%",
// 		fontSize: 25,
// 		marginLeft: "10%",
// 		color: "rgb(211,184,115)",
// 		paddingBottom: "2%",
// 	},
// 	DescriptionBox: {
// 		paddingBottom: "5%",
// 		paddingRight: "10%",
// 		paddingLeft: "10%",
// 		fontSize: 14,
// 		textAlign: "left",
// 	},
// 	imageStyle: {
// 		marginRight: 30,
// 		height: 220,
// 		width: 150,
// 		borderBottomLeftRadius: 10,
// 		borderBottomRightRadius: 10,
// 		borderTopLeftRadius: 10,
// 		borderTopRightRadius: 10,
// 	},
// 	flatList: {
// 		height: 250,
// 		flexGrow: 0,
// 	},

// 	profileImage: {
// 		marginLeft: "8%",
// 		height: 40,
// 		width: 40,
// 		borderRadius: 40,
// 		overflow: "hidden",
// 	},
// 	profileName: {
// 		fontSize: 14,
// 		fontWeight: "400",
// 		paddingLeft: "2%",
// 		paddingTop: 10,
// 	},
// });

// export default DescriptionTab;
