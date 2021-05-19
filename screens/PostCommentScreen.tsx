import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Alert, FlatList, Animated,TouchableOpacity,TextInput,Pressable,KeyboardAvoidingView,Platform } from "react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import ReplyChange from "../components/review-screen-components/ReplyChange";
import { Rating,Overlay } from 'react-native-elements';
import { AntDesign } from "@expo/vector-icons";
import moment from 'moment';
import { SafeAreaView } from "react-native-safe-area-context";
import { getData } from "../constants/utility";
import axios from "axios";




type typeImageData = { id: string; source: string };

type IItem = {
	item: typeImageData;
	index: number;
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
type dataDescrip = {
	item: descriptionType;
};

type comment = {
	id:string,
	timeCreated:any,
	likeCount: number,
	images:string[], 
	uid: any,
	content: string,
	aid: string,
	rating : number 
}

type InforUser = {
	id:string,
	gender : string,
	address : string[],
	name:string,
	phoneNumber: string,
	friendsCount : number,
	totalReward : number,
	journeyCount : number,
	urlAvatar : string
}


type ListData = descriptionType[]


interface uniqueReviews  {
	comment: comment,
	userInfo : InforUser

}





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

const PassedData = {
	name : "Dat",
	content : "i enjoyed the trip so much",
	timeCreated: "18:20 12-3-2020",
	avatar : "https://media.vneconomy.vn/w900/images/upload/2021/04/20/8-crop-15385326887281768852049.jpg",
	rating : 4,
	likeCount: 3


}

const PostComment = () =>{
	const offset = useRef(new Animated.Value(0)).current;
	const description = "aaaaaaaaaa";
	const [text, setText] = useState<string>("");
	const [userID, setUserID] = useState<any>();
	

	const renderImage = ({ item, index }: IItem) => {
		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
	};

	const [data, setData] = useState<uniqueReviews[]>([]);
	let id = "JmTVF0qul9fTptyQjzNQ";
	let rid = "0NefT72ZDBlnlVsgnOem";
	let userContent = "";
	let wordHolder = "please type your reply here";

	async function getUser() {
		let id = await getData("id");
		return id;
	}

	// fetch list of reviews 
	useEffect(() => {
		console.log("effect called")
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply/reviews/${id}`)
		.then((response) => response.json())
		.then((json) => {
            setData(json)
			console.log("==============================")
            console.log(json) // For debugging. Check if the effect is called multiple times or not
			getUser().then(data => setUserID(data))
        })
		.catch((err) => console.error(err))
	},[])

	let dataPoint = 0
	let dataCombine = [] as ListData

	data.forEach((review) => {
		let ThisData = {} as descriptionType  
		const timestamp = new Date(review.comment.timeCreated._seconds * 1000);
		const formattedDate = (moment(timestamp)).format('HH:mm DD-MM-YYYY');
		ThisData.id = dataPoint.toString()
		dataPoint ++
		ThisData.content = review.comment.content
		ThisData.avatar = review.userInfo.urlAvatar
		ThisData.timeCreated = formattedDate;
		ThisData.name = review.userInfo.name
		ThisData.rating = review.comment.rating
		dataCombine.push(ThisData)
	})

	let content = "fuck expo"
	// dataCombine.forEach((datapoint) => {
	// 	console.log("=============================================\n\n\n")
	// 	console.log("hahaa")
	// 	console.log(datapoint.avatar)
	// })
	console.log("                    \n\n\n\n")




	const renderDescription = ({ item }: dataDescrip) => (
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

    
    const handleReview = (review:string) =>{
		setText(review)
		
    }

	const submitFunc = () =>{
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply`,{
			method: "POST",
			headers: { 
			Accept: 'application/json',
			'Content-Type': 'application/json' },
			body :JSON.stringify({
				rid:"JmTVF0qul9fTptyQjzNQ",
				uid:userID,
				content : text
			})
		})

		console.log(userID)
		console.log(text)
	}
	
	
    return (<>
        <View style={{ flex: 1 }} >
		<View style={{
			flex:0.23,
			backgroundColor:"#4B8FD2",
			borderBottomRightRadius:18,
			borderBottomLeftRadius:18
		}}>

		</View>
		<View style={{ flex: 1, backgroundColor: "white", paddingLeft: "5%", paddingRight: "5%" }}>
			<Animated.ScrollView
			style={{ backgroundColor: "white" }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{}}
			scrollEventThrottle={16}
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
				useNativeDriver: false,
			})}
			>

			<Text style={styles.descriptionTitle}>Review</Text>
			<View style={{paddingBottom : 20 }}>
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: PassedData.avatar}} style={styles.profileImage} />
				<View style={{marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<View style={{width: '73%'}}>

						<Text style={styles.profileName}>{PassedData.name}</Text>
						<Text style={styles.timeStamp}>{PassedData.timeCreated}</Text>
					</View>
					<View style={{ width: '10%' }}>
						<Rating 
							imageSize={15} 
							readonly 
							startingValue={PassedData.rating} 
							style={styles.rating} 
						/>
					</View>
				</View>	
			</View>
			


			<View style={{marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10}}>
				<View style={{width: '10%',  marginRight: "2%"}}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={30} color={PassedData.likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", paddingLeft: 11, paddingTop: 20 }}>{PassedData.likeCount}</Text>
				</View>
				<View style={{ width: '80%'}}>
					<Text style={{ fontSize: 15 }}>{PassedData.content}</Text>
				</View>
				</View>
			</View>
			
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
			<Text style={styles.descriptionTitle}>reply</Text>
			<View style={{ paddingBottom: 0 }}>
				
				<FlatList
					data={dataCombine}
					renderItem={renderDescription}
					keyExtractor={(item) => item.id}
				></FlatList>
			</View>


			
			
			
			</Animated.ScrollView>
			<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"} >
				<ReplyChange handleReview={handleReview} word = {content} submitFunc = {submitFunc} />
			</KeyboardAvoidingView>
             
		</View>
        

            
        </View>
		</>
    )

}

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
		marginLeft: 5
	},
	timeStamp: {
		fontSize: 12,
		color: "#959595",
		fontWeight: "400",
	},
	rating: {
		paddingVertical: 10,
		justifyContent: 'flex-end'
	},
	containerButton : {
		width: 250,
		backgroundColor : "#E7E7E7",
		marginLeft:"5%",
		borderRadius: 12
	},
	centeredView: {
        flex: 1,
        justifyContent: "center", 
		position: 'absolute',
		bottom: 0,
        marginTop: 22,
    },
	overlay: {
        paddingVertical: 15,
		position: 'absolute',
        paddingHorizontal: 20,
        width: '86%'
    },
	textOverlap: {
		position: 'relative',
		fontSize: 20,
		textAlign: 'center',
		color: "#828282"
	},
	buttonText: {
		margin:11,
		position:"relative",
		alignContent:"center"
		
	},
    postTitle : {
        margin: 11,
        position: "relative",
        alignContent:"center"
    },
	submitButton: {
		width: 300,
		padding: 20,
		backgroundColor: "#4B8FD2",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#fff",
		alignItems: "center",
		marginBottom: 20
	}

})

export default PostComment;
