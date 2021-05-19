import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import { Header, Button, Overlay } from 'react-native-elements'
import { AntDesign } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/core';



const ViewVoucher = () => {
    
    return (
        <View style={styles.voucherOverlay}>
            <View style={styles.overlaySectionContainer}>
                <Image
                source={{uri :"https://manwah.com.vn/wp-content/uploads/sites/22/2021/01/Artboard-107@10x.png"}}
                style={styles.partnerLogo}
                />
            </View>
            <View style={styles.overlaySectionContainer}>
                <Text>
                    Discount 40% on all items
                </Text>
            </View>
            <View style={styles.overlaySectionContainer}>
                <QRCode
                value="12331"
                size={windowWidth*0.6}
                />
            </View>
        </View>
    )
}

const MyVoucherScreen = () => {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const toggleOverlay = () => {
      setVisible(!visible);
    };
  

    return (
        <View style={{width: '100%'}}>
            <Header
				leftComponent={
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>My vouchers</Text>}
			/>
            <View>
            <View style={{width: '100%'}}>
                <Button title="Open Overlay" onPress={toggleOverlay} />

                <Overlay style={{width: '100%'}} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <ViewVoucher/>
                </Overlay>
                </View>
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
    partnerLogo: {
        width: 80,
        height: 80,
        resizeMode: 'contain'
    },
    voucherOverlay: {
        alignItems: 'center',
        width: windowWidth * 0.8,
        height: '60%'
    },
    overlaySectionContainer: {
        marginTop: 10
    }
})

export default MyVoucherScreen