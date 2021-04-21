import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Rating } from 'react-native-elements';


// Upload to firebase cloudstore function
async function uploadImage(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    let name = uri.split("/")[-1]
    var ref = firebase.storage().ref().child("images/" + name);
    return ref.put(blob)
}


const CameraButton = () => {

    const [image, setImage] = useState<any>(null);


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    // launch camera and capture function
    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setImage(result.uri)
        }
    };

    return (
        <View>
            {image == null ?
                // Photo not taken
                <View style={{ backgroundColor: '#dfebf7', width: 160, height: 160, justifyContent: 'center', alignItems: 'center', borderColor: '#2966A3', borderRadius: 160 / 2, borderWidth: 1 }}>
                    <TouchableOpacity
                        onPress={() => pickImage()}
                    >
                        <Image
                            source={require('../assets/photo-camera.png')}
                            style={styles.cameraImage}
                        />
                    </TouchableOpacity>

                </View>
                // If the photo is taken
                : 
                <View>
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                    <Rating
                    showRating
                    />
                </View>
            }
        </View>


    )
}

const CameraScreen = () => {

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CameraButton />
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