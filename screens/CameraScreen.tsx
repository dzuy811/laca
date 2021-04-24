import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native'
import { Rating, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';

// Upload to firebase cloudstore function
async function uploadImage(uriArray: string[], rating:number) {
    console.log(rating)
    for (let i = 0; i < uriArray.length; i++) {
        let uri = uriArray[i]
        const response = await fetch(uri);
        const blob = await response.blob();

        // split to get the name from the file
        let uriSplitString = uri.split("/")
        let filename = uriSplitString[uriSplitString.length - 1].split('.')[0]
        console.log("name: ", filename)
        // var ref = firebase.storage().ref().child("images/" + filename);
        // await ref.put(blob)
        // ref.getDownloadURL()
        //     .then((url) => {
        //         console.log(url.toString())
        //     })
    }
    
}

type propsSetRating = (rating: number) => void
type propsSetReview = (review: string) => void

interface reviewSectionProps {
    image: string[],
    setReview: propsSetReview,
    review: string,
    setRating: propsSetRating,
}
// type of the react hook set state


// Hide keyboard when tapping outside


const CameraScreen = () => {

    const CameraButton:React.FC = () => {
    
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
    const [review, setReview] = useState<string>();
    
    console.log("image: ", image)

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
            setImage([...image,result.uri])
        }
    };

    useEffect(() => {
        console.log("rating:", rating)
    },[rating])


    return (
        <TouchableWithoutFeedback style={{height: '100%'}} onPress={Keyboard.dismiss} accessible={false}>

            <SafeAreaView style={{height: '100%', width:'100%',backgroundColor:'#fff' }}>
                {image.length==0? 
                <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => pickImage()}>
                        {console.log(image)}
                        <CameraButton />
                    </TouchableOpacity>
                </View>
                    
                    :
            <View style={{height: '100%',justifyContent: 'center'}}>
                <View style={{flexDirection:'row', flexWrap:'wrap', marginLeft: 55}}>
                    {image.map(i => 
                    <View key={i} style={{marginRight: 10}}>
                    <Image
                        style={{
                            width: 80,
                            height: 80
                        }}
                        source={{ uri: i }}
                    />
                    </View>
    
                        
                    )}

                    {image.length < 3?

                        <View style={{backgroundColor: '#efefef' ,width: 80, height: 80, borderStyle: 'dashed', borderRadius: 1, borderWidth: 1, borderColor: '#d6d6d6', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => pickImage()}>
                            <Image
                                    source={require('../assets/photo-camera.png')}
                                    style={{width: 30, height: 30}}
                                
                                />
                        </TouchableOpacity>
                        

                        </View>
                    :
                    <Text>
                        You reached limit of 3 photos for 1 review
                    </Text>
                    }

                   
                </View>

                
                <View>
                    <Rating
                    onFinishRating={(ratings) => setRating((ratings))}
                    defaultRating
                    imageSize={30}
                    
                    />
                </View>
                    <View style={{alignItems: 'center'}}>
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder={"Leave your review about the attraction..."}
                            placeholderTextColor={"#9E9E9E"}
                            numberOfLines={10}
                            multiline={true}
                            onChangeText={reviews=>setReview(reviews)}
                        />
                    </View>
                    <View style={styles.submitContainer}>
                        <Button
                        buttonStyle={styles.submitButton}
                        title="Submit"
                        titleStyle={styles.submitButtonText}
                        onPress={() => uploadImage(image, rating)}
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
        borderRadius: 20 ,
        borderColor: '#f1f1f1',
        borderWidth: 2,
        backgroundColor : "#fff",
        width: 300,
        padding: 20
    },
    submitContainer: {
        marginTop: 20,
        width: '100%',
        alignItems:'center'
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
    }
})