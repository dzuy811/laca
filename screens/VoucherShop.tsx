import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

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

const [data, setData] = useState<any>();

const VoucherCard = ({ item }: dataVoucher) => (
		<View style={{ marginBottom: 30}}>
			{item.expiryDateTime}
		</View>
	);


const VoucherShop:React.FC<voucherScreenProps> = () => {
    return(
        <View>
            {/* Header */}
            <View style={{height: 20, backgroundColor: "#4B8FD2", flexDirection: 'row'}}>
                <View style={[style.reward]}>
                    <FontAwesome5 style={{ marginRight: 2 }} name="coins" size={24} color="#E2D0A2" />
                    <Text style={{ marginLeft: 2, fontSize: 18 }}>400</Text>
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
	cardBody: {
		paddingTop: 15,
		paddingLeft: 25,
		paddingRight: 10,
		paddingBottom: 30,
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
		// alignItems: "center",
        // alignSelf: 'flex-end'
        marginLeft: "auto"
    },
});
