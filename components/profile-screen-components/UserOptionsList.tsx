import React from 'react'

import { View, Text, StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import UserOption from './UserOption'

interface Props {
    navigation: any
}

const UserOptionsList: React.FC<Props> = ({navigation}) => {
    return(
        <View>
            <UserOption navigation={navigation} name="History"/>
            <UserOption navigation={navigation} name="Voucher"/>
            <UserOption navigation={navigation} name="Favorite attraction"/>
            <UserOption navigation={navigation} name="Help"/>
        </View>
    )
}

export default UserOptionsList