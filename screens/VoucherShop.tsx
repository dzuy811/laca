import React, { useState, useEffect } from "react";
import { 
	StyleSheet, 
	View, 
	Text, 
	FlatList, 
	Dimensions, 
	Image, 
	Pressable, 
	ScrollView,
	Alert
} from "react-native";
import moment from 'moment';
import { getData } from "../constants/utility";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const coinImage = require("../assets/coin.png");

type voucherType = {
    id: string,
    content: string,
    expiryDateTime: string,
    redeemed: number,
    rewardPrice: number,
    totalQuantity: number,
	imageUrl: string
}

type dataVoucher = {
	item: voucherType;
	index: number;
};

const VoucherShop:React.FC<any> = () => {
	const [data, setData] = useState<any>();
	const [userID, setUserID] = useState<any>();
	const [userReward, setUserReward] = useState<number>(800);

	useEffect(() => {
		fetch('https://asia-east2-laca-59b8c.cloudfunctions.net/api/partner-rewards')
        .then((response) => response.json())
        .then((json) => {
			getUser().then(data => setUserID(data));
			getUserReward().then(data => setUserReward(Number(data)));
			let rawData = [] as voucherType[];
			json.partnerRewards.forEach((element: any) => {
				let eachData = {} as voucherType;
				eachData.id = element.id;
				eachData.content = element.content;
				eachData.totalQuantity = element.totalQuantity;
				eachData.rewardPrice = element.rewardPrice;
				eachData.imageUrl = element.partner.imageUrl;

				const timestamp = new Date(element.expiryDatetime._seconds * 1000);
				const formattedDate = (moment(timestamp)).format('DD.MM.YYYY');

				eachData.expiryDateTime = formattedDate;
				rawData.push(eachData);
			});
			setData(rawData);
        })
        .catch((err) => console.error(err))
	}, [])

	async function getUser() {
		let id = await getData("id");
		return id;
	}

	async function getUserReward() {
		let reward = await getData("total_reward");
		return reward;
	}

	const VoucherCard = ({ item, index }: dataVoucher) => (
		<View key={index} style={styles.voucherBox}>

			{/* Image */}
			<View style={{ flexDirection: 'row'}}>
				<View style={{width:"40%"}}>
					<Image 
						style={{width: 100, height: 80, margin:10}} 
						source={{uri: item.imageUrl}} 
					/>
				</View>
				
				{/* Right Box*/}
				<View style={{width:"60%", margin: 4, marginTop: 10}}>
					<Text style={{fontSize: 15, marginRight: 6}}>{item.content}</Text>
					<View style={{marginTop: 10}}>
						<Text style={{fontSize: 15}}>Expired: {item.expiryDateTime}</Text>
						<Text style={{fontSize: 15}}>Quantity: {item.totalQuantity}</Text>
					</View>
					<View style={{flexDirection: 'row', marginTop: 10}}>
						<Image 
							style={{marginRight: 5, height:20, width: 20}}
							source={coinImage}
						/>
						<Text>{item.rewardPrice}</Text>
					</View>
				</View>
			</View>

			{/* Exchange Button */}
			<View style={{alignItems: "center", marginTop: 10}}>
					<Pressable 
						style={styles.submitButton}
						onPress={() => {
							// If the user has enough reward point
							if(userReward >= item.rewardPrice) {
								console.log(userID);
								let body = {
									userID: userID,
									partnerRewardID: item.id
								}
								let url = "https://asia-east2-laca-59b8c.cloudfunctions.net/api/partner-reward-codes/acquire";
								axios.put(url, body).then(res => {
									console.log(res.data);
									let reward = userReward - item.rewardPrice;
									setUserReward(reward);
									Alert.alert("Exchange successfully!")
								}).catch(err => console.log(err.response.data))
							} else {
								Alert.alert("You don't have enough reward point to exchange this voucher!");
							}
						}}
					>
						<Text style={{color: "#E2D0A2", fontWeight: "bold"}}>Exchange</Text>
					</Pressable>
				</View>
		</View>
	);

    return(
        <View>
			<ScrollView>

				{/* Header */}
				<View style={{height: 80, backgroundColor: "#4B8FD2", flexDirection: 'row'}}>
					<View style={[styles.reward]}>
					<Image 
							style={{marginRight: 5, height:20, width: 20}}
							source={coinImage}
						/>
						<Text style={{ marginLeft: 5, fontSize: 18, color: "#E2D0A2" }}>{userReward}</Text>
					</View>
				</View>

				<View>

				{/* FlatList for each reward */}
					<FlatList
						data={data}
						renderItem={VoucherCard}
						keyExtractor={(item) => item.id}
					/>
				</View>
				<View style={{height: 50}}>
				</View>
			</ScrollView>
        </View>
    )
}

export default VoucherShop;

const styles = StyleSheet.create({
	voucherBox: {
		borderColor: "#4B8FD2", 
		height:windowHeight - 600, 
		width: windowWidth - 60, 
		borderWidth: 4, 
		backgroundColor: "#FDFDFD",
		marginTop: 30,
		marginLeft: 30,
		marginRight: 30
	},
	reward: {
		alignItems: "center",
        alignSelf: 'flex-end',
        marginLeft: "auto",
		flexDirection: 'row',
		marginHorizontal:20,
		marginBottom: 10
    },
	submitButton: {
		width: 250,
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#4B8FD2",
		alignItems: "center"
	}
});