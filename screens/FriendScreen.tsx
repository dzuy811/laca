import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Button, SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const FriendScreen = ({navigation}) => {

    const [text, setText] = useState("");

    const [foundUser, setFoundUser] = useState(null);

    const [user, setUser] = useState(firebase.auth().currentUser);

    const [friendRequests, setFriendRequests]: any[] = useState([])

    const [state, getState] = useState('')

    // fetching user's friend requests

    function fetchRequest(userID: string) {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/users/${userID}/`
        const promise = axios.get(url)
        const data = promise.then(res => res.data)
        return data
    }

    useFocusEffect(
        React.useCallback(() => {
          const unsubscribe = fetchRequest(user.uid).then(data => {
                setFriendRequests(data)
                console.log('SUCCESS: Friend requests fetch succssfully');
                console.log('-------------------------------------------');
                console.log(data)   
            })
    
          return () => unsubscribe;
        }, [navigation])
      );

    // useEffect(() => {
    //         fetchRequest(user.uid)
    //             .then(data => {
    //                 setFriendRequests(data)
    //                 console.log('SUCCESS: Friend requests fetch succssfully');
    //                 console.log('-------------------------------------------');
    //                 console.log(data)             
    //             })
    // }, [navigation])

    function searchUser(phone: string) {
        // localhost-home: http://192.168.2.105:5001/laca-59b8c/asia-east2/api
        // deploy: https://asia-east2-laca-59b8c.cloudfunctions.net/api 
        const url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/search/details?phone=${phone}`
        fetch(url)
        .then(res => res.json())
        .then(foundUserData => {
            if (foundUserData.id == undefined) {
                setFoundUser(null)
            } else {
                console.log("--------------")
                let friendshipURL = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendships/get?userID=${user?.uid}&otherUserID=${foundUserData.id}`
                fetch(friendshipURL)
                .then(message => message.json())
                .then(data => {
                    if (data.id == undefined) {
                        foundUserData['isFriend'] = false;   
                    } else {
                        foundUserData['isFriend'] = true;
                    }
                    
                    setFoundUser(foundUserData)
                })
                
                
                // check if friend 
            }
        })
    }

    function acceptRequest(requestID: string) {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/accept`
        let body = {
            friendRequestID: requestID
        }
        axios.post(url, body)
        .then(res => {
            if (user) {
            fetchRequest(user.uid)
                .then(data => {
                    setFriendRequests(data)
                    console.log('SUCCESS: Friend requests fetch successfully');
                    console.log('-------------------------------------------');
                    
                })
            }
            else {
                console.log('ERROR: No user found');
                console.log('-------------------------------------------');   
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    function removeRequest(requestID: string) {
        let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendrequests/${requestID}/remove`
        axios.delete(url)
        .then(res => {
            if (user) {
            fetchRequest(user.uid)
                .then(data => {
                    setFriendRequests(data)
                    console.log('SUCCESS: Friend requests fetch successfully');
                    console.log('-------------------------------------------');
                    
                })
            }
            else {
                console.log('ERROR: No user found');
                console.log('-------------------------------------------');   
            }
        })
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={Keyboard.dismiss}>

        <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
            <View style={{
                padding: 20
                }}>
                <SearchBar
                    keyboardType='number-pad'
                    textContentType={'telephoneNumber'}
                    enablesReturnKeyAutomatically={true}
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
                    onSubmitEditing={() => searchUser(text)}
                    placeholderTextColor='#dfebf7'                    
                />
            </View>
            {foundUser != null ? 

                    <>
                        {foundUser.isFriend == false? 
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
                        <TouchableOpacity onPress={() => navigation.navigate("Friend Profile", { data: foundUser})}>
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
                       </>
                    }
                    </>
    
            
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
                {friendRequests.map((request, id) => 
                    <View key={id} style={{width: '100%',flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 50}}>
                        <TouchableOpacity 
                        activeOpacity={0.8} 
                        style={{width: '100%'}} 
                        onPress={() => navigation.navigate("User Profile",
                                            {  data: request.sendUser,
                                                requestID: request.id,
                                                
                                            })}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{marginHorizontal: 15}}>
                                    <Image
                                        source={{ uri: request.sendUser.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View style={{width: '100%'}}>
                                    <Text>{request.sendUser.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{position:'absolute', top:30, left: 10 ,flexDirection: 'row', marginHorizontal: 80}}>
                                <View style={{marginHorizontal: 10}}>
                                    <Button
                                    title="Accept"
                                    buttonStyle={styles.requestAcceptButton}
                                    onPress={() => acceptRequest(request.id)}
                                    />                                        
                                </View>
                                <View>
                                    <Button
                                    title="Remove"
                                    type="outline"
                                    buttonStyle={styles.requestRemoveButton}
                                    onPress={() => removeRequest(request.id)}
                                    />
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
    requestRemoveButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    }
})

export default FriendScreen