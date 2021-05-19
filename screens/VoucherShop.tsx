import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, Image } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const coinImage = require("../assets/coin.png");

type voucherScreenProps = {
    
}

type voucherType = {
    id: string,
    content: string,
    expiryDateTime: Date,
    redeemed: number,
    rewardPrice: number,
    totalQuantity: number
}

type dataVoucher = {
	item: voucherType;
};

const VoucherShop:React.FC<voucherScreenProps> = () => {
	const [data, setData] = useState<any>([
		{
			"id": 1
		},
		{
			"id": 2
		},
		{
			"id": 3
		}
	]);

	const VoucherCard = ({ item }: dataVoucher) => (
		<View style={style.voucherBox}>
			<View style={{width:"40%"}}>
				<Image 
					style={{width: 100, height: 80, margin:10}} 
					source={{uri: "https://manwah.com.vn/wp-content/uploads/sites/22/2021/01/Artboard-107@10x.png"}} 
				/>
			</View>
			<View style={{width:"60%", margin: 4, marginTop: 10}}>
				<Text style={{fontSize: 15}}>Discount Voucher 25% on all items</Text>
				<Text style={{fontSize: 15}}>Expired: 18.05.2021</Text>
				<Text style={{fontSize: 15}}>Quantity: 4</Text>
				<Image
					source={coinImage}
				/>

			</View>
			
		</View>
	);

    return(
        <View>
            {/* Header */}
            <View style={{height: 80, backgroundColor: "#4B8FD2", flexDirection: 'row'}}>
                <View style={[style.reward]}>
                    <FontAwesome5 style={{ marginRight: 2 }} name="coins" size={24} color="#E2D0A2" />
                    <Text style={{ marginLeft: 5, fontSize: 18, color: "#E2D0A2" }}>400</Text>
                </View>
            </View>

            {/* FlatList for each reward */}
            <FlatList
				data={data}
			    renderItem={VoucherCard}
				keyExtractor={(item) => item.id}
			></FlatList>
        </View>
    )
}

export default VoucherShop;

const style = StyleSheet.create({
	item: {
		marginRight: 15,
	},
	cardContainer: {
		backgroundColor: "#fff",
		width: 350,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	cardImage: {
		height: 360,
		width: "100%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	voucherBox: {
		margin: 30, 
		borderColor: "#4B8FD2", 
		height:windowHeight - 600, 
		width: windowWidth - 80, 
		borderWidth: 2, 
		flexDirection: 'row',
		backgroundColor: "#FDFDFD"
	},
	firstInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	attractionName: {
		fontSize: 24,
	},
	reward: {
		alignItems: "center",
        alignSelf: 'flex-end',
        marginLeft: "auto",
		flexDirection: 'row',
		margin:20
    },
});
