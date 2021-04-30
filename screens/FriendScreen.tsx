import React from 'react'
import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Button, SearchBar } from 'react-native-elements';

const FriendScreen = () => {

    return (
        <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
            <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <Text>Search a user via phone number</Text>
            </View>
            <View style={{
                padding: 20
                }}>
                <SearchBar
                    placeholder="Search a user"
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
            <View style={{flexDirection: 'row', justifyContent:'center'}}>
                <Button
                 title="Search"
                 type="clear"
                 containerStyle={{width: '90%'}}
                 style={{
                     backgroundColor: '#8dbae2',
                     paddingHorizontal: 50,
                     paddingVertical: 10,
                     borderRadius: 30
                 }}
                 titleStyle={{
                     color: '#deebf7'
                 }}
                 
                />
            </View>
        </SafeAreaView>
    )
}


export default FriendScreen