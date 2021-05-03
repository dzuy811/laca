import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from "react-native";
import FormUserProfile from "../components/FormUserProfile";
import { RadioButton } from "react-native-paper";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { Button, Header } from "react-native-elements";
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/storage';
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function OtherProfileScreen({ route, navigation }) {

    const [data, setData] = useState(route.params.data);
    const [isRequested, setIsRequested] = useState<boolean>();
    const requestID = route.params.requestID
    
    function acceptRequest(requestID: string) {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/accept`
        let body = {
            friendRequestID: requestID
        }
        console.log(body)
        axios.post(url, body)
        .then(res => {
            navigation.goBack()
        })
        .catch(err => {
            console.log(err);
        })
    }

    function removeRequest(requestID: string) {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/${requestID}/remove`
        axios.delete(url)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }


    function checkUserRelationship(data: {}) {
        let user = firebase.auth().currentUser
        let url = `http://localhost:5000/laca-59b8c/asia-east2/api/friendrequests/get?userID=${user?.uid}&otherUserID=${data.id}`
        console.log(url);
        axios.get(url)
        .then(res => {
            setIsRequested(true)
        })
        .catch(err => {
            setIsRequested(false)
        })
    }

    useEffect(() => {
        checkUserRelationship(data)
        
    }, [])


    return (
        <View>
            {/* Navigation */}
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="#fff" />
                    </TouchableOpacity>
                }
                centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>Profile</Text>}
            />

            {/* Image */}
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: data.urlAvatar }} resizeMode={"cover"} />
            </View>

            {/* Form */}
            <View>
                <View style={styles.dataContainer}>
                    <Text style={{
                        height: 26,
                        fontSize: 14,
                        color: "#BDBDBD",
                    }}>
                        Phone number
                    </Text>
                    <Text>
                        {data.phoneNumber}
                    </Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={{
                        height: 26,
                        fontSize: 14,
                        color: "#BDBDBD",
                    }}>
                        Name
                    </Text>
                    <Text>
                        {data.name}
                    </Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text
                        style={{
                            height: 26,
                            fontSize: 14,
                            color: "#BDBDBD",
                        }}
                    >
                        Gender
					</Text>
                    <Text>
                        {data.gender}
                    </Text>
                </View>

            </View>
            <View style={{marginTop: 80}}>
                {isRequested? 
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <View style={{marginHorizontal: 10}}>
                        <Button
                        title="Accept"
                        buttonStyle={styles.buttonRequest}
                        onPress={() => acceptRequest(requestID)}
                        />                                        
                    </View>
                    <View>
                        <Button
                        title="Remove"
                        type="outline"
                        buttonStyle={styles.buttonRequest}
                        onPress={() => removeRequest(requestID)}
                        />
                    </View>
                </View>
                :
                <Button
                title="Connect"

                buttonStyle={{
                    width: '90%', 
                    alignSelf: 'center', 
                    backgroundColor: '#8dbae2',
                    paddingHorizontal: 50,
                    paddingVertical: 18,
                    borderRadius: 30
                }}
                />
                }
               
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    containerForm: {
        width: "100%",
        paddingBottom: 20,
    },
    containerNavigator: {
        height: 90,
        width: "100%",
        backgroundColor: "#4B8FD2",
    },
    textAvatar: {
        alignSelf: "center",
        marginTop: 10,
        fontWeight: "bold",
        color: "#8DBAE2",
        fontSize: 15,
    },
    image: {
        height: 140,
        width: 140,
        backgroundColor: "#FFF",
        borderRadius: 100,
        marginTop: 30,
    },
    dataContainer: {
        paddingTop: 5,
        marginTop: 24,
        marginLeft: 22,
        marginRight: 32,
    },
    signOutButton: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: 40,
        left: 0,
        top: windowHeight - 350,
        width: windowWidth,
    },
    textSignOut: {
        fontSize: 18,
        color: "#8DBAE2",
        opacity: 0.7,
    },

    progressBarContainer: {
        marginTop: 20
    },
    buttonRequest: {
        paddingHorizontal: 50,
        paddingVertical: 16,
    }

});
export default OtherProfileScreen;
