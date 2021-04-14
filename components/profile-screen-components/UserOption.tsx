import React from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface type {
    name: string,
    navigation: any
}

const UserOption: React.FC<type> = (props: type) => {

    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('Journey History')}>
            <View style={{borderBottomColor: '#2966A3', borderBottomWidth: 1}}>
                <View style={{backgroundColor: '#DFEBF7', height: 50, justifyContent: 'center', padding: 15}}>
                    <Text style={{}}>{props.name}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
}

export default UserOption