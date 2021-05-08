import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import 'firebase/firestore';
import 'firebase/storage';
import axios from "axios";
import { Button, Overlay } from 'react-native-elements';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function FriendProfile({ route, navigation }) {

    const [data, setData] = useState(route.params.data);

    const [modalVisible, setModalVisible] = useState(false);

    const unfriend = () => {
        let url = `http://localhost:5000/laca-59b8c/asia-east2/api/friendships/${data.id}/remove`
        axios.delete(url)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
        navigation.goBack()
    }

    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
      setVisible(!visible);
    };
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
                rightComponent={
                    <TouchableOpacity
                        onPress={() => toggleOverlay()}
                        style={{marginRight: 10}}
                    >
                        <Text style={{color: '#dedede'}}>Unfriend</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.centeredView}>
                <View>
                    <Overlay
                    isVisible={visible}
                    onBackdropPress={() => toggleOverlay()}
                    overlayStyle={styles.overlay}
                    >
                        <Text style={{fontSize: 16}}>Are you sure you want to revmove {data.otherUser.name} as your friend?</Text>
                        <View style={{flexDirection: 'row', justifyContent:'flex-end', marginTop: 15}}>
                            <TouchableOpacity onPress={() => toggleOverlay()}>
                                <Text style={styles.cancelButton}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => unfriend()}>
                                <Text style={styles.confirmButton}>CONFIRM</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </Overlay>
                </View>
            </View>


            {/* Image */}
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: data.otherUser.urlAvatar }} resizeMode={"cover"} />
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
                        {data.otherUser.phoneNumber}
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
                        {data.otherUser.name}
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
                        {data.otherUser.gender}
                    </Text>
                </View>

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    overlay: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '86%'
    },
    cancelButton: {
        fontSize: 15,
        marginRight: 20
    },
    confirmButton: {
        fontSize: 15,
        color: '#488fd2'
    }

});
export default FriendProfile;
