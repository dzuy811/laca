import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Alert, FlatList, Animated,TouchableOpacity } from "react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { Rating } from 'react-native-elements';
import moment from 'moment';


type typeImageData = { id: string; source: string };

type IItem = {
	item: typeImageData;
	index: number;
};

type DescriptionType = { id: string; name: string; avatar: string; content: string ; timeCreated: string;
	rating : number; };
type dataDescrip = {
	item: DescriptionType;
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


type ListData = DescriptionType[]


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
	avatar : "https://media.vneconomy.vn/w900/images/upload/2021/04/20/8-crop-15385326887281768852049.jpg",
	rating : 4


}

const ReviewScreen = () =>{
	const offset = useRef(new Animated.Value(0)).current;
	const description = "aaaaaaaaaa";
	const renderImage = ({ item, index }: IItem) => {
		return <Image key={index} source={{ uri: item.source }} style={styles.imageStyle} />;
	};

	const [data, setData] = useState<uniqueReviews[]>([]);
	let id = "WVqYqkOT5OLDLChK6jsG"

	// fetch list of reviews 
	useEffect(() => {
		console.log("effect called")
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reply/reviews/${id}`)
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



	const renderDescription = ({ item }: dataDescrip) => (
		<View>
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: item.avatar}} style={styles.profileImage} />
				{/* <Text style={styles.profileName}>{item.name}</Text> */}
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
			<View style={styles.DescriptionBox}>
				<Text style={{ fontSize: 12 }}>{item.content}</Text>
			</View>
		</View>
	);

	
	
    return (<>
        <View style={{ flex: 1 }} >
		{/* <AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} /> */}
		<View style={{ flex: 1, backgroundColor: "white", paddingLeft: "5%", paddingRight: "5%" }}>
			{/* <AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} /> */}
			<Animated.ScrollView
			style={{ backgroundColor: "white" }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{}}
			scrollEventThrottle={16}
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
				useNativeDriver: false,
			})}
			>

			<Text style={styles.DescriptionTitle}>Review</Text>
			{/* <Text style = {styles.DescriptionBox}> {description}</Text> */}
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: PassedData.avatar}} style={styles.profileImage} />
				{/* <Text style={styles.profileName}>{PassedData.name}</Text> */}
				<View style={{width: '73%'}}>
						<Text style={styles.profileName}>{PassedData.name}</Text>
						{/* <Text style={styles.timeStamp}>{item.timeCreated}</Text> */}
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
			<Text style={styles.DescriptionTitle}>reply</Text>
			<View style={{ paddingBottom: 10 }}>
				
				<FlatList
					data={dataCombine}
					renderItem={renderDescription}
					keyExtractor={(item) => item.id}
				></FlatList>
			</View>
			<View style = {{flexDirection: "row", paddingLeft: "5%", paddingRight: "5%"}}>
			<Image source={{uri: PassedData.avatar}} style={styles.profileImage} />
			<TouchableOpacity style={styles.containerButton}>
				<Text style = {styles.buttonText}>type your comment here</Text>
				
			</TouchableOpacity>
				
			</View>

			



			
			</Animated.ScrollView>

		</View>

            
        </View>
		</>
    )

}

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
	buttonText: {
		margin:11,
		position:"relative",
		alignContent:"center"
		
	}

})

export default ReviewScreen;
