import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

interface type {
    name: string 
}

const UserOption: React.FC<type> = (props: type) => {

    return (
        <View style={{borderBottomColor: '#2966A3', borderBottomWidth: 1}}>
            <View style={{backgroundColor: '#DFEBF7', height: 50, justifyContent: 'center', padding: 15}}>
                <Text style={{}}>{props.name}</Text>
            </View>
        </View>
    )
}

export default UserOption