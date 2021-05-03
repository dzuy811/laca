import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Button, SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';

const FriendScreen = ({navigation}) => {

    const [text, setText] = useState("");

    const [foundUser, setFoundUser] = useState(null);

    const [user, setUser] = useState(firebase.auth().currentUser);

    const [friendRequests, setFriendRequests] = useState([])

    // fetching user's friend requests
    useEffect(() => {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/users/${user?.uid}/`
        console.log(url)
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setFriendRequests(data);
        })
    }, [friendRequests])

    function searchUser(phone: string) {
        // localhost-home: http://192.168.2.105:5001/laca-59b8c/asia-east2/api
        // deploy: https://asia-east2-laca-59b8c.cloudfunctions.net/api 
        const url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/search/details?phone=${phone}`
        console.log(url)
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.id == undefined) {
                setFoundUser(null)
            } else {
                setFoundUser(data)
            }
        })
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={Keyboard.dismiss} accessible={false}>

        <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
            <View style={{
                padding: 20
                }}>
                <SearchBar
                keyboardType='number-pad'
                    placeholder="Search a user"
                    onChangeText={(value) => setText(value)}
                    value={text}
                    style={{
                        backgroundColor: '#fff',

                    }}
                    containerStyle={{
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#dfebf7'
                        
                    }}
                    inputContainerStyle={{
                        backgroundColor: '#fff',                        
                    }}
                    placeholderTextColor='#dfebf7'                    
                />
            </View>
            {foundUser != null? 
            <TouchableOpacity onPress={() => navigation.navigate("User Profile", { data: foundUser})}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginBottom: 20}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{marginHorizontal: 15}}>
                            <Image
                                source={{ uri: foundUser.urlAvatar }}
                                style={styles.logo}
                            />
                        </View>
                        <View>
                            <Text>{foundUser.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            
            :
            <>
            </>
            }
            
            <View style={{flexDirection: 'row', justifyContent:'center'}}>
                <Button
                activeOpacity={0.8}
                 title="Search"
                 type="clear"
                 containerStyle={{width: '90%'}}
                 buttonStyle={{
                    backgroundColor: '#8dbae2',
                    paddingHorizontal: 50,
                    paddingVertical: 18,
                    borderRadius: 30
                 }}
                 titleStyle={{
                     color: '#deebf7'
                 }}
                 onPress={() => searchUser(text)}
                 
                />
            </View>
            <View style={{ paddingHorizontal: 15, marginTop: 20}}>
                <Text style={{fontSize: 18}}>
                    Friend Requests
                </Text>
            </View>
            {friendRequests != [] ?
            <View style={{marginTop: 15}}>
                {friendRequests.map((request, uid) => 
                    <View key={uid}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 20}}>
                        <View style={{  }}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => navigation.navigate("User Profile", { data: request.sendUser})}>
                                <View style={{marginHorizontal: 15}}>
                                    <Image
                                        source={{ uri: request.sendUser.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View>
                                    <Text>{request.sendUser.name}</Text>
                                </View>
                            </TouchableOpacity>
                          
                            <View style={{flexDirection: 'row', marginHorizontal: 80, }}>
                                <View style={{marginHorizontal: 10}}>
                                    <Button
                                    title="Accept"
                                    buttonStyle={styles.requestAcceptButton}
                                    />                                        
                                </View>
                                <View>
                                    <Button
                                    title="Decline"
                                    type="outline"
                                    buttonStyle={styles.requestDeclineButton}
                                    />
                                </View>
                            </View>
                           
                        </View>
                    </View>
                </View>
                )}
            </View>
            
            :

            <>
            </>
            }
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    logo: {
        width: 60,
        height: 60,
        borderRadius: 50
      },
    requestAcceptButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    requestDeclineButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    }
})

export default FriendScreen