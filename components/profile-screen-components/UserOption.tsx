import React from 'react'

import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface type {
    name: string,
    navigation: any,
    color: string,
    icon: ImageSourcePropType
}

const UserOption: React.FC<type> = (props: type) => {

    return (
        <TouchableOpacity onPress={() => props.navigation.navigate(props.name)}>
            <View style={[styles.userOptionContainer,{ borderColor: props.color}]}>
                <View style={{height: '100%', backgroundColor: props.color, width: 5, borderRadius: 20 }}></View>
                <Image
                style={{marginLeft: 10}}
                source={props.icon}/>
                <View style={{ justifyContent: 'center', marginLeft: 15}}>
                    <Text style={{color: 'black'}}>{props.name}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    userOptionContainer: {
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    }
})

export default UserOption