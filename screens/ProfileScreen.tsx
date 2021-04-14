import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import ProfileHeader from '../components/profile-screen-components/ProfileHeader'
import UserOptionsList from '../components/profile-screen-components/UserOptionsList'

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './ProfileStackParams'

type ProfileScreenNavigationProp = StackScreenProps<RootStackParamList, 'Profile Screen'>

const ProfileScreen = ({route, navigation}: ProfileScreenNavigationProp) => {
    return <View>
        <View>
            <ProfileHeader/>
        </View>
        <View style={{marginTop: 50}}>
            <UserOptionsList navigation={navigation}/>
        </View>
    </View>
}

export default ProfileScreen