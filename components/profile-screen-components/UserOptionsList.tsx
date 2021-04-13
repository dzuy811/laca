import React from 'react'

import { View, Text, StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import UserOption from './UserOption'

interface Props {
    name: string,
}

const UserOptionsList: React.FC<Props> = () => {
    return(
        <View>
            <UserOption name="History"/>
            <UserOption name="Voucher"/>
            <UserOption name="Favorite attraction"/>
            <UserOption name="Help"/>
        </View>
    )
}

export default UserOptionsList