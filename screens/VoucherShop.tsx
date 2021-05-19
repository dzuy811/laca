import React, { useState, useEffect } from "react";
import { 
	StyleSheet, 
	View, 
	Text, 
	FlatList, 
	TouchableOpacity, 
	Dimensions, 
	Image, 
	Pressable, 
	ScrollView 
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from 'moment';

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

	useEffect(() => {
		fetch('https://asia-east2-laca-59b8c.cloudfunctions.net/api/partner-rewards')
        .then((response) => response.json())
        .then((json) => {
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
							console.log("Button pressed!")
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
						<FontAwesome5 style={{ marginRight: 2 }} name="coins" size={24} color="#E2D0A2" />
						<Text style={{ marginLeft: 5, fontSize: 18, color: "#E2D0A2" }}>400</Text>
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
		margin:20
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