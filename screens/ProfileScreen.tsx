import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import ProfileHeader from '../components/profile-screen-components/ProfileHeader'
import UserOptionsList from '../components/profile-screen-components/UserOptionsList'

const ProfileScreen = () => {
    return <View>
        <ProfileHeader/>
        <UserOptionsList/>
    </View>
}

export default ProfileScreen