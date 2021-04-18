import React from 'react'

import { View, Text, StyleSheet, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'

const ProfileHeader = ({navigation}) => {
    
    return <View style={styles.profileHeaderContainer}>
        <View style={{flexGrow: 1}}>
            <Image
            style={styles.tinyLogo}
            source={{uri: 'https://sotaydoanhtri.com/wp-content/uploads/2019/11/Monkey-Test-It.jpg'}}
            />   
        </View>
        <View style={{flexGrow: 2}}>
            <View>
                <Text style={styles.name}>Nguyễn Ngọc Đăng Hưng</Text>
            </View>
            <View>
                <Text style={styles.city}>Hồ Chí Minh city</Text>
            </View>
        </View>
        <View>
            <MaterialIcons onPress={() => navigation.navigate('Edit profile')} name="keyboard-arrow-right" size={24} color="#fff" />
        </View>
    </View>
}

const styles = StyleSheet.create({
    profileHeaderContainer: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 230,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 20
    },
    tinyLogo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    name: {
        color: '#DFEBF7',
        fontSize: 18
    },
    city: {
        color: '#BED8EE'
    }
})

export default ProfileHeader