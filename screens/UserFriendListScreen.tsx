import React, { useEffect, useState} from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import { Header } from 'react-native-elements'
import { AntDesign } from "@expo/vector-icons";
import { RootStackParamList } from './ProfileStackParams'
import { StackNavigationProp } from '@react-navigation/stack'
import axios from 'axios'
import firebase from 'firebase';
import { useFocusEffect } from '@react-navigation/native';


type UserFriendListNavigationProp = StackNavigationProp<
    RootStackParamList,
    "My friends"
>

type Props = {
    navigation: UserFriendListNavigationProp
}

const UserFriendListScreen = (props:Props) => {

    const [loading, setLoading] = useState(true)
    const [friends, setFriends] = useState([])
    const [sortedData, setSortedData] = useState([])


    useFocusEffect(
        React.useCallback(() => {

            let userID = firebase.auth().currentUser?.uid
            let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/${userID}/friendships`
            const unsubscribe = axios.get(url).then(res => {
                setFriends(res.data.friendships)
                setSortedData(res.data.friendships)
                console.log('SUCCESS: Friendship fetch succssfully');
                console.log('-------------------------------------------');
            }).catch(err => console.log(err))
            .finally(() => setLoading(false))
    
          return () => unsubscribe;
        }, [props.navigation])
      );

    useEffect(() => {
        console.log("friends: ", friends);
        let copyArr
        if (friends?.length > 0) {
            // Copy to another array to avoid mutation in state
            copyArr = [...friends]
            // Sort base on alphabetical name
            copyArr.sort((a,b) => a.otherUser.name.localeCompare(b.otherUser.name))
            
            // Set state
            setSortedData(copyArr)
        }
       
        
    
    }, [friends])
    
    console.log("sorted: ", sortedData)


    return (
        <View>
            <Header
				leftComponent={
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				}
				centerComponent={<Text style={{ fontSize: 18, color: "#fff" }}>My Friends</Text>}
			/>
                {!loading?

                
                            <View style={{marginTop: 20}}>
                                
                    {sortedData?.map(friend => 
                        <View key={friend.id} style={{width: '100%',flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 50}}>
                           <TouchableOpacity 
                           activeOpacity={0.8} 
                           style={{width: '100%'}} 
                           onPress={() => props.navigation.navigate("Friend profile", {data: friend})}
                           >
                               <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                   <View style={{marginHorizontal: 15}}>
                                       <Image
                                           source={{ uri: friend.otherUser.urlAvatar }}
                                           style={styles.logo}
                                       />
                                   </View>
                                   <View style={{width: '100%'}}>
                                       <Text style={{fontSize: 18}}>{friend.otherUser.name}</Text>
                                   </View>
                               </View>
                           </TouchableOpacity>
                   </View>
                        )}
                                    </View>

                :

                <View>
                    <Text>Loading</Text>
                </View>
            
                }
            
        </View>
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

export default UserFriendListScreen