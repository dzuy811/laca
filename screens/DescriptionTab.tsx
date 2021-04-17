import React, {useRef} from "react";
// import React from "react";
import {View, Text,StyleSheet, Dimensions, Image,Button,Alert,ScrollView,TouchableOpacity,FlatList, Animated,Platform } from "react-native";
import { Ionicons, FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AnimatedHeader from "../components/AnimatedHeader";
import { TabRouter } from "@react-navigation/routers";

const logo = require('../assets/icon.png');


type IItem  = {
    item:typeImageData
}

const renderImage = ({item}:IItem) =>(
    <Image source = {{uri:item.source}} style = {styles.imageStyle}  />
)

const HEADER_HEIGHT = 0;

type props = {
    route: any,
    navigation: any
}

const DescriptionTab:React.FC<props> = ({route ,navigation}) => {
    
    const workPlease = useRef(new Animated.Value(0)).current;
    const headerHeight = workPlease.interpolate({
        inputRange: [0, HEADER_HEIGHT ],
        outputRange: [HEADER_HEIGHT + 200, 400 + 44],
        extrapolate: 'identity'
      });

      return (
            <View style={{flex: 1}}>
                <Animated.View style={
                    // styles.header
                    {height : headerHeight,
                    backgroundColor : "#4B8FD2"}
                    }>
                {/* <View
                        style = {{flexDirection: "row",justifyContent: 'space-evenly'}} >
                        <TouchableOpacity
                                style={styles.buttonBack}
                               onPress={onPressThing}>
                               <Ionicons name="ios-arrow-back-sharp" size = {35} color = {"white"}/>
                           </TouchableOpacity>
                           
                           <TouchableOpacity
                               style={styles.buttonInfo}
                               onPress={onPressThing}>
                               <MaterialCommunityIcons name="information-outline" size = {35} color = {"white"} />
                           </TouchableOpacity>
                           
                       </View>
                   
                       <Text style = {styles.nameLocation}> 
                           Landing Screen
                       </Text>
                       <Text style = {styles.DistancePlace}>
                           0.7 km 
                       </Text> */}
                </Animated.View>
               <View style = {{flex:0.8,
               marginTop :"2%"
            }}>
               <ScrollView>
                   {/* <View style={styles.header}>
                       <View
                           style = {{flexDirection: "row",justifyContent: 'space-evenly'}} >
                           <TouchableOpacity
                               style={styles.buttonBack}
                               onPress={onPressThing}>
                               <Ionicons name="ios-arrow-back-sharp" size = {35} color = {"white"}/>
                           </TouchableOpacity>
                           
                           <TouchableOpacity
                               style={styles.buttonInfo}
                               onPress={onPressThing}>
                               <MaterialCommunityIcons name="information-outline" size = {35} color = {"white"} />
                           </TouchableOpacity>
                           
                       </View>
                   
                       <Text style = {styles.nameLocation}> 
                           Landing Screen
                       </Text>
                       <Text style = {styles.DistancePlace}>
                           0.7 km 
                       </Text>
                       
                   </View> */}


                   <View>
                       <Text style = {styles.DescriptionTitle}>
                           Description
                       </Text>
                       <Text style = {styles.DescriptionBox}>
                           Em vào đời bằng đại lộ còn anh vào đời bằng lối nhỏ
                           Anh nhớ mình đã từng thổ lộ, anh nhớ rằng em đã chối bỏ
                           Anh nhớ chuyến xe buổi tối đó, trên xe chỉ có một người ngồi
                           Anh thấy thật buồn nhưng nhẹ nhõm, anh nhớ mình đã mỉm cười rồi
                           Anh nghĩ anh cần cảm ơn em, vì những gì mà anh đã nếm trải
                           Kỉ niệm sẽ là thứ duy nhất, đi theo anh cả cuộc đời dài
                           Nếu không có gì để nhớ về, anh sợ lòng mình khô nứt nẻ
                           Hình dung em như là Nữ Oa, có thể vá tâm hồn này sứt mẻ


           
                       </Text>
                       <Text style = {styles.DescriptionTitle}>
                           Gallery
                       </Text>
                       <ScrollView style={{marginLeft:'10%'}}>
                       <FlatList
                       data = {Data}
                       renderItem = {renderImage}
                       keyExtractor = {item=>item.id}
                       horizontal={true}
                       showsHorizontalScrollIndicator={false}
                       style = {styles.flatList}
                       />
                       </ScrollView>
                   

                       <Text style = {styles.DescriptionTitle}>
                           Reviews
                       </Text>
                       <FlatList
                       data = {descriptionData}
                       renderItem = {renderDescription}
                       keyExtractor={item =>item.id}
                       >

                       </FlatList>
                   </View>
               </ScrollView>
               </View>
                <View style={{
                alignItems : "center",
                // backgroundColor :"rgba(190,98,29,0.25)"
                // backgroundColor:"rgba(52, 52, 52, 0.8)"
                backgroundColor:"transparent",
                marginTop:"2%",
                flex:0.15

                }}>
                    <TouchableOpacity
                    onPress = {() => {
                        navigation.navigate('Journey Map', {
                            latitude: route.params.latitude,
                            longitude: route.params.longitude
                        } )
                    }}
                    style = {styles.buttonChosing}>
                        <View>
                            <Text style = {styles.choseButton} >
                                Accept the journey
                            </Text>
                        </View>
           
                    </TouchableOpacity>       
                </View>


            </View>
        
        
        
        
    )
}

export default DescriptionTab;

type typeImageData = {id:string, source:string}

const Data = [
    {id : "01", source : "https://s1.cdn.autoevolution.com/images/news/mint-mercedes-slr-stirling-moss-for-sale-at-4-million-108621_1.jpg"},
    {id : "02", source : "https://s1.cdn.autoevolution.com/images/news/mint-mercedes-slr-stirling-moss-for-sale-at-4-million-108621_1.jpg"},
    {id : "03", source : "https://s1.cdn.autoevolution.com/images/news/mint-mercedes-slr-stirling-moss-for-sale-at-4-million-108621_1.jpg"},
    {id : "04", source : "https://s1.cdn.autoevolution.com/images/news/mint-mercedes-slr-stirling-moss-for-sale-at-4-million-108621_1.jpg"},
    {id : "05", source : "https://s1.cdn.autoevolution.com/images/news/mint-mercedes-slr-stirling-moss-for-sale-at-4-million-108621_1.jpg"},

]

const descriptionData = [
    {id: "01", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    {id: "02", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    {id: "03", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    {id: "04", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    {id: "05", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    {id: "06", name :"user 1",avatar : "../assets/user.jpg", textComment : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},

]






type DescriptionType = {id:string, name:string,avatar:string,textComment : string }
type dataDescrip  = {
    item : DescriptionType;
}

const renderDescription = ({item}:dataDescrip) =>(
    <View>
        <View style={{flexDirection: "row"}}>
            <Image source = {logo} style = {styles.profileImage}

            />
            <Text style = {styles.profileName}>f{item.name}</Text>

        </View>
        <View style = {styles.DescriptionBox} >
            <Text>
            {item.textComment}
            </Text>
        </View>
    </View>
    
)

const onPressThing = () => {
    Alert.alert(
        "Alert Title",
        "My Alert Msg",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed")
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ])
}

const styles = StyleSheet.create ({
    
    header: {


/* aero/dark */
        position: 'relative',
        height : 200,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "#4B8FD2",
        borderBottomRightRadius: 30,
        borderBottomLeftRadius:30
    },
    nameLocation : {
        textAlign:"center",
        textAlignVertical :"bottom",
        paddingTop:"2%",
        marginBottom:"2%",
        lineHeight : 70,
        fontSize : 30

    },
    DistancePlace: {
        textAlign:"center",
        textAlignVertical :"center",
        paddingTop:"2%",
        fontSize : 10,
        paddingBottom : "5%"
    },
    buttonBack : {
        paddingTop:"2%",
        marginRight : 120,
        marginTop: "3%",
        
    },
    buttonInfo: {
        paddingTop:"2%",
        marginLeft: 120,
        marginTop:"3%",
       
        
    },

    DescriptionTitle :{
        marginTop : "4%",
        fontSize:25,
        marginLeft : "10%",
        color : "rgb(211,184,115)",
        paddingBottom:"2%"
    },
    DescriptionBox:{
        paddingTop:"5%",
        paddingRight :"10%",
        paddingLeft:"10%",
        fontSize: 18,
        textAlign:"left",
        
    },
    imageStyle :{
        marginRight: 30,
        height:220,
        width: 150,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
         
    },
    flatList: {
        height: 250,
        flexGrow: 0
    },

    profileImage : {
    marginLeft:"8%",
    height: 40,
    width: 40,
    borderRadius: 40,
    overflow:"hidden"
    },
    profileName:{
        fontSize:28,
        paddingLeft:"4%"
    },

    buttonChosing : {
        backgroundColor : "#4B8FD2",
        alignItems : "center",
        justifyContent: 'center',
        borderRadius : 50,
        width: '90%',
        marginTop: '5%',
        height: 70,        
        
    },
    choseButton : {
        fontSize : 20, 
        color:'#E2D0A2',
    }
})