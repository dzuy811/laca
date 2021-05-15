import React, { Component, useState, useEffect, JSXElementConstructor } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import { Header } from "react-native-elements";
import * as Location from "expo-location";
import LoadingHomeScreen from "../screens/LoadingHomeScreen";
import AttractionList from "../components/AttractionList";
import { useNavigation } from '@react-navigation/native'
import Category from "../components/Category";

type homeScreenProps = {

    navigation: any,
    address: string
}

const HomeScreen:React.FC<homeScreenProps> = ({address}) => {

    const navigation = useNavigation()

    const [data, setData] = useState([])

    useEffect(() => {
        console.log("homescreen props: ", address);
        
        fetch('https://asia-east2-laca-59b8c.cloudfunctions.net/api/attractions')
        .then((response) => response.json())
        .then((json) => {
            setData(json)
            console.log("Attraction list" ) // For debugging. Check if the effect is called multiple times or not
        })
        .catch((err) => console.error(err))
    },[])

    return (
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                <Header
                leftComponent={
                    <Text style={{color: '#fff'}}>{address || "Location not available"}</Text>
                }
                leftContainerStyle={{flex:4}}
                />
                <View style={style.sectionContainer}>
                    <Text style={style.sectionHeading}>Popular attractions</Text>
                    <View style={style.cardList}>
                        <AttractionList navigation={navigation} attractions={data}/>
                    </View>
                </View>
                <View style={style.sectionContainer}>
                     <Text style={style.sectionHeading}>Category</Text>
                     <View style={style.categoryList}>
                         <View style={style.categoryRow}>
                            <Category bgColor='#fbc6a4' name='Art' image={require('../assets/paint-palette.png')}/>
                            <Category bgColor='#f4a9a8' name='History' image={require('../assets/history.png')}/>
                            <Category bgColor='#ce97b0' name='Apartment' image={require('../assets/apartment.png')} />
                         </View>
                         <View style={style.categoryRow}>
                            <Category bgColor='#94d0cc' name='Relics' image={require('../assets/relics.png')}/>
                            <Category bgColor='#c6ffc1' name='Cave' image={require('../assets/cave.png')}/>
                            <Category bgColor='#766161' name='Coffee' image={require('../assets/coffee-cup.png')} />
                         </View>
                     </View>
                </View>
               
                
        </ScrollView>
    )
}

export default HomeScreen

const style = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: "#4B8FD2",
		height: 100,
		alignItems: "center",
	},
	cardList: {
		width: '100%',
        marginTop: 28,
        marginLeft: -16
	},
	button: {
		backgroundColor: "blue",
		padding: 20,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 20,
		color: "#fff",
	},
    sectionContainer: {
        marginLeft: 16,
        paddingVertical: 20
    },
    sectionHeading: {
        color: "#4B8FD2",
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1
    },
    categoryList: {
        marginTop: 10,
    },
    categoryRow: {
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }

});
