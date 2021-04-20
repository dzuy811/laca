import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'


const CameraButton = () => {
    return (
        <View style={{backgroundColor: '#dfebf7' ,width: 160, height: 160, justifyContent:'center', alignItems: 'center', borderColor: '#2966A3', borderRadius: 160/2, borderWidth: 1}}>
            <Image
            source={require('../assets/photo-camera.png')}
            style={styles.cameraImage}
        />
        </View>
    )
}

const CameraScreen = () => {
    
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <CameraButton/>
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    cameraImage: {
        width: 60,
        height: 60,
        tintColor: '#2966A3'
    }
})