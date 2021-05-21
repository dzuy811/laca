import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable, ActivityIndicator} from 'react-native'
import { Header, Button, Overlay } from 'react-native-elements'
import { AntDesign } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/core';
import firebase from 'firebase'
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';



const coinImage = require("../assets/coin.png");

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get("window").height;

type voucherType = {
    id: string,
    content: string,
    expiryDateTime: string,
    redeemed: number,
    rewardPrice: number,
	imageUrl: string,
    code: string
}

type dataVoucher = {
	item: voucherType;
	index: number;
};





const ViewVoucher = (props) => {
    // console.log(props);
    
    return (
        <View style={styles.voucherOverlay}>
            <View style={styles.overlaySectionContainer}>
                <Image
                source={{uri : props.imageUrl}}
                style={styles.partnerLogo}
                />
            </View>
            <View style={styles.overlaySectionContainer}>
                <Text>
                    {props.content}
                </Text>
            </View>
            <View style={styles.overlaySectionContainer}>
                <QRCode
                value={props.code}
                size={windowWidth*0.6}
                />
            </View>
        </View>
    )
}

const MyVoucherScreen = () => {

    const [user, setUser] = useState(firebase.auth().currentUser);
    const [userVoucher, setUserVoucher] = useState<any>();
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);
    const toggleOverlay = () => {
        setVisible(!visible);
      };
  
    const VoucherCard = ({ item, index }: dataVoucher) => {


        
        return (
        <View key={index} style={styles.voucherBox}>
            <View style={{width: '100%'}}>
                <Overlay overlayStyle={{borderRadius: 20}} style={{width: '100%'}} isVisible={visible} onBackdropPress={() => toggleOverlay()}>
                    <ViewVoucher imageUrl={item.imageUrl} code={item.code} content = {item.content} />
                </Overlay>
            </View>
    
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
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 10, alignItems:'center'}}>
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
                            toggleOverlay()
                        }}
                    >
                        <Text style={{color: "#E2D0A2", fontWeight: "bold"}}>Redeem</Text>
                    </Pressable>
                </View>
        </View>
    )};

    useEffect(() => {
        let mounted = true;
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/partner-reward-codes/users/${user?.uid}`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (mounted) {
                setLoading(false)
                let rawData = [] as voucherType[];
                
			    data.partnerRewardCodes.forEach((element: any) => {
                    console.log("element: ", element);
                    
				let eachData = {} as voucherType;
				eachData.id = element.id;
				eachData.content = element.partnerReward.content;
				eachData.rewardPrice = element.partnerReward.rewardPrice;
				eachData.imageUrl = element.partnerReward.partner.imageUrl;
                eachData.code = element.code

				const timestamp = new Date(element.partnerReward.expiryDatetime._seconds * 1000);
				const formattedDate = (moment(timestamp)).format('DD.MM.YYYY');

				eachData.expiryDateTime = formattedDate;
				rawData.push(eachData);
			});
			setUserVoucher(rawData);
            }
        })
        .catch(err => {
            console.log(err);            
        })
        return () => {
            mounted = false;
        }
    }, [])
  

    return (
        <View style={{width: '100%', height: '100%'}}>
            <Header
				leftComponent={
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>My vouchers</Text>}
			/>
            {loading? 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <ActivityIndicator size="large" color="#2966A3"/>
            </View>
            :
            <View>
                <FlatList
                    data={userVoucher}
                    renderItem={VoucherCard}
                    keyExtractor={(item) => item.id}
                />
            </View>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    partnerLogo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        
    },
    voucherOverlay: {
        alignItems: 'center',
        width: windowWidth * 0.8,
        padding: 20
    },
    overlaySectionContainer: {
        marginTop: 10,
    },
    voucherBox: {
        padding: 20,
		borderColor: "#4B8FD2", 
		width: windowWidth - 60, 
		borderWidth: 4, 
		backgroundColor: "#FDFDFD",
		marginTop: 30,
		marginLeft: 30,
		marginRight: 30,
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
})

export default MyVoucherScreen