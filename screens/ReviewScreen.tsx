import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Alert, FlatList, Animated,TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { Rating , Header} from 'react-native-elements';
import { AntDesign } from "@expo/vector-icons";
import moment from 'moment';
import { getData } from "../constants/utility";
import firebase from "firebase";
import ReplyChange from "../components/review-screen-components/ReplyChange";



type props = {
	navigation: any,
	route : {
		params:{
		id : string,
		content: string,
		rating: number,
		urlAvatar:string,
		timeStamp: string,
		username : string,
		likeCount: number,
		images: any[],
		refreshFunction:any
		}
	}
}

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

type imgprop = { id:string,
source : string}



const ReviewScreen = ({navigation,route} : props) =>{


	const [user, setUser] = useState<any>(firebase.auth().currentUser);
	const [UserInfor, setUserInfor] = useState({});
	const [text, setText] = useState<string>("");
	const submitFunc = () =>{
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply`,{
			method: "POST",
			headers: { 
			Accept: 'application/json',
			'Content-Type': 'application/json' },
			body :JSON.stringify({
				rid:id,
				uid:userID,
				content : text
			})
		})
		.then( (res) =>{
			if (res.status == 200){
				refresh();
				setViewBox(false)
				
			}
		}
			
		)
		console.log(userID)
		console.log(text)
	}

	async function getUser() {
		let uid = await getData("id");
		return uid;
	}
	
	
// const ReviewScreen = () =>{
	const offset = useRef(new Animated.Value(0)).current;
	const description = "aaaaaaaaaa";
	const renderImage = ({ item, index }: IItem) => {
		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
	};

	const [data, setData] = useState<uniqueReviews[]>([]);
	const [userID, setUserID] = useState<any>();

	const [ViewBox,setViewBox] = useState(false);

	const {id,content,rating,urlAvatar,timeStamp,username,likeCount,images,refreshFunction} = route.params

	let imgData: imgprop[] = []
	let imgCount = 0
	images.forEach(imgi =>{
		imgCount ++;
		let imgdt = {
			id: imgCount.toString(),
			source : imgi
		}
		imgData.push(imgdt)
		

	})

	const refresh = () => {
		
		console.log("effect called")
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply/reviews/${id}`)
		.then((response) => response.json())
		.then((json) => {
			setData(json)
			console.log("==============================")
			console.log(json) // For debugging. Check if the effect is called multiple times or not
			getUser().then(data => {
				
				setUserID(data)
				console.log("user id: ", data);
				
			})
		})
		.catch((err) => console.error(err))
		
	
		console.log(data[0])
	
		console.log("before Fetch user")
		async function getUserInfo() {
			// Get user's information from collection
			firebase.firestore().collection("users").doc(user.uid).get().then((user_info: object) => { 
			let dataInfo = user_info.data();
			setUserInfor(dataInfo) 
		})
		.catch((error) => { console.log("error:", error) });
		}
		getUserInfo();
		setDataCombine();

	}



	// let name = `Review of ${username}`
	// fetch list of reviews 
	console.log("before fetch reply")
	console.log(id)

	useEffect(() => {
		console.log("effect called")
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply/reviews/${id}`)
		.then((response) => response.json())
		.then((json) => {
            setData(json)
			console.log("==============================")
            console.log(json) // For debugging. Check if the effect is called multiple times or not
			getUser().then(data => {
				
				setUserID(data)
				console.log("user id: ", data);
				
			})
        })
		.catch((err) => console.error(err))
	},[])

	console.log(data[0])

	console.log("before Fetch user")
	useEffect(() => {
		async function getUserInfo() {
			// Get user's information from collection
			firebase.firestore().collection("users").doc(user.uid).get().then((user_info: object) => { 
			let dataInfo = user_info.data();
			setUserInfor(dataInfo) 
		})
		.catch((error) => { console.log("error:", error) });
		}
		getUserInfo();
    },[])


	let dataPoint = 0
	let dataCombine = [] as ListData
	
	const setDataCombine = () =>{
		if(data.length > 0) {
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
			dataCombine.forEach((datapoint) => {
				console.log("=============================================\n\n\n")
				console.log("hahaa")
				console.log(datapoint.avatar)
			})
		}
	}

	const handleReview = (review:string) =>{
		setText(review)
    }

	setDataCombine();


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
						{/* <Rating 
							imageSize={15} 
							readonly 
							startingValue={item.rating} 
							style={styles.rating} 
						/> */}
					</View>
				</View>

			</View>
			<View style={{marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10}}>
				{/* <View style={{width: '10%',  marginRight: "2%"}}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={30} color={item.likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", paddingLeft: 11, paddingTop: 20 }}>{item.likeCount}</Text>
				</View> */}
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
								{/* <TouchableOpacity onPress={() => console.log("Reply")}>
									<Text style={{color: "#40D0EF", fontWeight: "bold"}}> View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}</Text>
								</TouchableOpacity> */}
						</View>
					)}
				</View>
			</View>
		</View>
	);

	
	
    return (<>
        <View style={{ flex: 1 }} >
		<Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
						navigation.goBack();
						refreshFunction()
					}}>
                        <AntDesign name="arrowleft" size={24} color="#fff" />
                    </TouchableOpacity>
                }
                centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>{`Reply`}</Text>}
            />
		<View style={{ flex: 1, backgroundColor: "white", paddingLeft: "5%", paddingRight: "5%" }}>
			<Animated.ScrollView
			style={{ backgroundColor: "white" ,marginBottom: 15}}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{}}
			scrollEventThrottle={16}
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
				useNativeDriver: false,
			})}
			>
					{/* const {id,content,rating,urlAvatar,timeStamp,username,likeCount} = route */}


			<Text style={styles.descriptionTitle}>Review</Text>
			<View style={{paddingBottom : 20 }}>
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: urlAvatar}} style={styles.profileImage} />
				<View style={{marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<View style={{width: '73%'}}>

						<Text style={styles.profileName}>{username}</Text>
						<Text style={styles.timeStamp}>{timeStamp}</Text>
					</View>
					<View style={{ width: '10%' }}>
						<Rating 
							imageSize={15} 
							readonly 
							startingValue={rating} 
							style={styles.rating} 
						/>
					</View>
				</View>	
			</View>
			


			<View style={{marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10}}>
				<View style={{width: '10%',  marginRight: "2%"}}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={30} color={likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", paddingLeft: 11, paddingTop: 20 }}>{likeCount}</Text>
				</View>
				<View style={{ width: '80%'}}>
					<Text style={{ fontSize: 15 }}>{content}</Text>
				</View>
				</View>
			</View>
			<View style={{ marginLeft: "10%" }}>
				<FlatList
					data={imgData}
					renderItem={renderImage}
					keyExtractor={(item) => item.id}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={styles.flatList}
				/>
			</View>
			<Text style={styles.descriptionTitle}>Reply</Text>
			<View style={{ paddingBottom: 0 }}>
				
				<FlatList
					data={dataCombine}
					renderItem={renderDescription}
					keyExtractor={(item) => item.id}
				></FlatList>
			</View>
			{ !ViewBox ? (
				<View style = {{flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
				<Image source={{uri: UserInfor.urlAvatar}} style={styles.profileImage} />
				<TouchableOpacity style={styles.containerButton} onPress={() =>{
					 console.log("do it ");
					 setViewBox(true);
				}}>
					<Text style = {styles.buttonText}>Type your comment here</Text>
					
				</TouchableOpacity>
					
				</View>
			) : (
				<></>
			)
				
			}
			</Animated.ScrollView>
			{ViewBox?  (
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"} >
						<ReplyChange handleReview={handleReview} word = {`Type your reply here`} submitFunc = {submitFunc} />
				</KeyboardAvoidingView>
			) : (
				<></>
			)
				
			}
			

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
		
	}

})

export default ReviewScreen;
