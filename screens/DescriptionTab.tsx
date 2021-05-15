import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, StyleSheet, Image, FlatList, Animated, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import UserLogo from "../assets/fb_logo.png";
import moment from 'moment';
import { Rating } from 'react-native-elements';

import { LoginButton } from "../components";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimatedHeader from "../components/AnimatedHeader";
import axios from "axios";
import { getData } from "../constants/utility";

type iItem = {
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
			distance: number
		};
	};
	navigation: any;
};

type typeImageData = { 
	id: string; 
	source: string 
};

type descriptionType = { 
	id: string; 
	name: string; 
	avatar: string; 
	content: string; 
	timeCreated: string; 
	rating: number,
	likeCount: number,
	replyCount: number
};

type dataDescription = {
	item: descriptionType;

};

interface uniqueReviews  {
	comment: comment,
	userInfo : infoUser,
	replyCount: number
}

// Mock data for Gallery Pictures
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

type comment = {
	id: string,
	timeCreated: any,
	likeCount: number,
	images: string[], 
	uid: any,
	content: string,
	aid: string,
	rating : number,
}

type infoUser = {
	id: string,
	gender : string,
	address : string[],
	name: string,
	phoneNumber: string,
	friendsCount : number,
	totalReward : number,
	journeyCount : number,
	urlAvatar : string
}

type listData = descriptionType[]


const DescriptionTab = ({ route, navigation }: Props) => {
	const offset = useRef(new Animated.Value(0)).current;
	const { latitude, longitude, description, name, id, distance } = route.params;
	const [data, setData] = useState<uniqueReviews[]>([]);

	// fetch list of reviews 
	useEffect(() => {
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/attractions/${id}`)
		.then((response) => response.json())
		.then((json) => {
            setData(json)
            // console.log(json) 
        })
		.catch((err) => console.error(err))
	},[])
  
async function takeJourney() {
let body = {
  userID: await getData('id'),
  attractionID: id,
  status: "ongoing"
}
console.log(body);

axios.post('https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/histories', body)
.then(res => {
  console.log(res.data);
  navigation.navigate("Journey Map", {
	  // rmit 10.730283804989273, 106.69316143068589
	  // home 10.791044000816369, 106.6839532702234
    latitude: 10.791044000816369,
    longitude: 106.6839532702234,
	journeyID: res.data.id,
	attractionID: id
  });
}).catch(err => console.log(err))
}


	let dataPoint = 0;
	let dataCombine = [] as listData;

	data.forEach((review) => {
		let data = {} as descriptionType;

		// Format the timestamp from date to string
		const timestamp = new Date(review.comment.timeCreated._seconds * 1000);
		const formattedDate = (moment(timestamp)).format('HH:mm DD-MM-YYYY');

		data.id = dataPoint.toString();
		data.content = review.comment.content;
		data.avatar = review.userInfo.urlAvatar;
		data.name = review.userInfo.name;
		data.timeCreated = formattedDate;
		data.rating = review.comment.rating;
		data.likeCount = review.comment.likeCount;
		data.replyCount = review.replyCount;
	
		dataCombine.push(data);
	})

	// Render list of descriptions for Flat List
	const renderDescription = ({ item }: dataDescription) => (
		<View style={{ marginBottom: 30}}>
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: item.avatar}} style={styles.profileImage} />
				<View style={{marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<View style={{width: '73%'}}>

						<Text style={styles.profileName}>{item.name}</Text>
						<Text style={styles.timeStamp}>{item.timeCreated}</Text>
					</View>
					<View style={{ width: '10%' }}>
						<Rating 
							imageSize={15} 
							readonly 
							startingValue={item.rating} 
							style={styles.rating} 
						/>
					</View>
				</View>

			</View>
			<View style={{marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10}}>
				<View style={{width: '10%',  marginRight: "2%"}}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={30} color={item.likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", paddingLeft: 11, paddingTop: 20 }}>{item.likeCount}</Text>
				</View>
				<View style={{ width: '80%'}}>
					<Text style={{ fontSize: 15 }}>{item.content}</Text>
				</View>
				
				{/* Reply section */}
				<View style={{ paddingLeft: "10%" }}>
					{item.replyCount == 0 ? // if there is not any reply
					(
						<View>
						</View>
					) : (
						<View>
								<TouchableOpacity onPress={() => console.log("Reply")}>
									<Text style={{color: "#40D0EF", fontWeight: "bold"}}> View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}</Text>
								</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</View>
	);

	// Render list of images for Flat List
	const renderImage = ({ item, index }: iItem) => {
		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
	};

	return (
		<>
			<View style={{ flex: 1 }}>
				{/* Header */}
				<AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} headerDistance={distance}/>

				<View style={{ flex: 1, backgroundColor: "white"}}>
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
							{/* Description */}
							<Text style={styles.descriptionTitle}>Description</Text>
							<Text style={styles.descriptionBox}>{description}</Text>

							{/* Gallery */}
							<Text style={styles.descriptionTitle}>Gallery</Text>
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

							{/* Reviews */}
							<View style={{ paddingBottom: 100 }}>
								<Text style={styles.descriptionTitle}>Reviews</Text>
								<FlatList
									data={dataCombine}
									renderItem={renderDescription}
									keyExtractor={(item) => item.id}
								></FlatList>
							</View>
						</Animated.ScrollView>
					</View>
				</View>

				{/* Journey Starting Button */}
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
				>					
				<LoginButton
						title="Take the journey"
						onPress={() => takeJourney()}
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
	descriptionTitle: {
		marginTop: "4%",
		fontSize: 25,
		marginLeft: "10%",
		color: "rgb(211,184,115)",
		paddingBottom: "2%",
	},
	descriptionBox: {
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
		marginLeft: 30,
		height: 40,
		width: 40,
		borderRadius: 40,
		overflow: "hidden",
	},
	profileName: {
		fontSize: 16,
		fontWeight: "400",
	},
	timeStamp: {
		fontSize: 12,
		color: "#959595",
		fontWeight: "400",
	},
	rating: {
		paddingVertical: 10,
		justifyContent: 'flex-end'
	}
});

export default DescriptionTab;

