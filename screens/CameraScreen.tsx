import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Platform, TouchableWithoutFeedback, Keyboard, Modal, Pressable, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native'
import { Rating, Button, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'
import ImageReviewSection from '../components/review-screen-components/ImageReviewSection'
import TextBoxReviewSection from '../components/review-screen-components/TextBoxReviewSection'
import { getData, storeData } from '../constants/utility';

import axios from 'axios';


// Upload to firebase cloudstore function
async function createImagesArray(uriArray: string[]) {

    let images:string[] = []

        for await (const uri of uriArray) {
            console.log(uri);
            
            const response = await fetch(uri);
            const blob = await response.blob();
    
            // split to get the name from the file
            let uriSplitString = uri.split("/")
            let filename = uriSplitString[uriSplitString.length - 1].split('.')[0]
            console.log("name: ", filename)
    
            var ref = firebase.storage().ref().child("images/" + filename);
            await ref.put(blob)
            await ref.getDownloadURL()
                .then((url) => {
                    console.log("url: ", url);
                    images.push(url)    
                })
        
        }        
    console.log(images);
    return images
}


async function uploadReview(uriArray: string[], rating: number, review: string, journeyID: string, attractionID: string) {
    
    let body = {
        uid: await getData("id"),
        rating,
        content: review,
        aid: attractionID,
        images: await createImagesArray(uriArray)
    }
console.log("images: ", body.images);

    axios.post('https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews', body)
    .then(res => {
        console.log("body: ", body);
        console.log(res.data);
              
    })
    .then(() => {
        // still using local because not merge code for deploy yet
        axios.put(`http://192.168.2.105:5000/laca-59b8c/asia-east2/api/users/histories/${journeyID}/finish`)
        .then(() => {
            console.log("journey ID: ", journeyID);

            console.log("Journey completed")
        })
        .catch(err => {
            console.log("journey ID: ", journeyID);

            console.log(err);
        })
    })
    .catch(err => {
        console.log("body err: ", body);
        console.log(err)
    })

}



const CameraScreen = ({navigation, route }) => {
    console.log("camera screen route props: ", route);
    const { journeyID, attractionID, reward } = route.params
    

    const CameraButton: React.FC = () => {

        return (
            <View>
                <View style={{ backgroundColor: '#dfebf7', width: 160, height: 160, justifyContent: 'center', alignItems: 'center', borderColor: '#2966A3', borderRadius: 160 / 2, borderWidth: 1 }}>

                    <Image
                        source={require('../assets/photo-camera.png')}
                        style={styles.cameraImage}
                    />

                </View>
            </View>

        )
    }


    const [image, setImage] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(0)
    const [review, setReview] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [congratVisible, setCongratVisible] = useState(false);


    const toggleCongrat = () => {
        setCongratVisible(!congratVisible)
    }
 
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleReview(e: string) {
        setReview(e)
        console.log(e)
    }

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

    const removeImage = (e: string) => {
        let arr = image.filter(item => item != e)
        setImage(arr)
    }

    // launch camera and capture function
    const pickImage = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };


    // launch camera and capture function
    const pickVideo = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 0.8,
            videoMaxDuration: 5,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };

    const pickImageFromLibrary = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };

    const navigateBack = async (navigation) => {
        console.log(reward);
        await getData('total_reward').then(data => {storeData('total_reward',JSON.stringify(parseInt(data) + reward))})
        console.log(navigation)
        navigation.navigate('Home')
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={Keyboard.dismiss} accessible={false}>

            <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: '#fff' }}>
                {image.length == 0 ?
                    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => toggleOverlay()}>
                            <CameraButton />
                        </TouchableOpacity>
                        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                            <View style={{ width: 300, paddingTop: 10, paddingRight: 20, paddingLeft: 10, paddingBottom: 20 }}>
                                <View style={styles.overlayTextContainer}>
                                    <Text style={{ fontWeight: 'bold' }}>Select Image</Text>
                                </View>
                                <View style={styles.overlayTextContainer}>
                                    <TouchableOpacity>
                                        <Text onPress={() => pickImage()}>Take Photo...</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.overlayTextContainer}>
                                    <TouchableOpacity>
                                        <Text onPress={() => pickVideo()}>Record Video...</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.overlayTextContainer}>
                                    <TouchableOpacity>
                                        <Text onPress={() => pickImageFromLibrary()}>Choose from Lirabry...</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Overlay>

                    </View>

                    :
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                <View>
                    <Overlay
                    isVisible={congratVisible}
                    overlayStyle={styles.congratOverlay}
                    >
                        <Image style={{height: 250, width: 250}} source={require('../assets/2124.jpg')} />
                        <Text style={{fontSize: 26}}>Finish journey</Text>
                        <Text>You earn 100 points</Text>
                        <Button
                        titleStyle={styles.congratTitle}
                        buttonStyle={styles.congratButton}
                        onPress={() => navigateBack(navigation)}
                        activeOpacity={1}
                        title="Complete"
                        />                        
                    </Overlay>
                </View>

                           
                        <ImageReviewSection
                            pickImage={pickImage}
                            pickVideo={pickVideo}
                            pickImageFromLibrary={pickImageFromLibrary}
                            visible={visible}
                            removeImage={removeImage}
                            image={image}
                            toggleOverlay={toggleOverlay}
                        />

                        <View>
                            <Rating
                                onFinishRating={(ratings) => setRating((ratings))}
                                imageSize={30}

                            />
                        </View>
                        <TextBoxReviewSection handleReview={handleReview} />
                        <View style={styles.submitContainer}>
                            <Button
                                buttonStyle={styles.submitButton}
                                title="Submit"
                                titleStyle={styles.submitButtonText}
                                onPress={() => {
                                    uploadReview(image, rating, review, journeyID, attractionID)
                                    .then(() => {
                                        toggleCongrat()
                                    })
                                    
                                }}
                            />
                        </View>


                    </View>

                }


            </SafeAreaView>

        </TouchableWithoutFeedback>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    cameraImage: {
        width: 60,
        height: 60,
        tintColor: '#2966A3'
    },
    starLottie: {
        width: 50,
        height: 50,
    },
    rating: {
    },
    textArea: {
        height: 200,
        borderRadius: 20,
        borderColor: '#f1f1f1',
        borderWidth: 2,
        backgroundColor: "#fff",
        width: 300,
        padding: 20
    },
    submitContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center'
    },
    submitButton: {
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: 16,
        paddingHorizontal: 126,
        borderRadius: 50,
        borderColor: '#8DBAE2',
        backgroundColor: '#DFEBF7',
        borderWidth: 1,
    },
    submitButtonText: {
        color: '#4B8FD2',
        fontSize: 16,
        fontWeight: '300'
    },
    overlayTextContainer: {
        marginBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    overlay: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '86%'
    },
    cancelButton: {
        fontSize: 15,
        marginRight: 20
    },
    confirmButton: {
        fontSize: 15,
        color: '#488fd2'
    },
    congratOverlay: {
        alignItems: 'center',
        width: '85%',
        paddingHorizontal: 20,
        paddingVertical: 50,
        
        borderRadius: 20,

    },
    congratButton: {
        paddingHorizontal: 100,
        paddingVertical: 20,
        backgroundColor: '#4b8fd2',
        borderRadius: 50,
    },
    congratTitle: {
        color: '#e2dda2'
    }
})