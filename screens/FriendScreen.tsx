import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Button, SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FriendScreen = ({navigation}) => {

    const [text, setText] = useState("");

    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log(text);
    }, [text])


    function searchUser(phone: string) {
        const url = `http://192.168.2.105:5001/laca-59b8c/asia-east2/api/users/search/details?phone=${phone}`
        console.log(url)
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data == null) {
                setUser(null)
            } else {
                setUser(data)
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
            {user? 
            <TouchableOpacity onPress={() => navigation.navigate("User Profile", { data: user})}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginBottom: 20}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{marginHorizontal: 15}}>
                            <Image
                                source={{ uri: user.urlAvatar }}
                                style={styles.logo}
                            />
                        </View>
                        <View>
                            <Text>{user.name}</Text>
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
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
        borderRadius: 50
      },
})

export default FriendScreen