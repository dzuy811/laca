import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import { Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';

type attractionType = {
    id: string,
    name: string,
    reward: number,
    ratings: number,
    imageThumbnail: string,
}

interface CardProps  {
    data: attractionType
}


export default class AttractionCard extends Component<CardProps> {
    constructor(props: CardProps) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={0.8} style={[style.cardContainer, style.item]}
            >
                <View>
                    <Image style={style.cardImage} source={{ uri: `${this.props.data.imageThumbnail}`}} />
                </View>
                <View style={style.cardBody}>
                    <View>
                        <Text numberOfLines={1} style={style.attractionName}>
                            {this.props.data.name}
                        </Text>
                    </View>
                    <View style={{marginTop: 4}}>
                        <View style={style.firstInfo}>
                            <View style={[style.reward]}>
                                <FontAwesome5 style={{marginRight: 2}} name="coins" size={24} color="#E2D0A2" />
                                <Text style={{marginLeft: 2}} >{this.props.data.reward}</Text>
                            </View>
                            <View style={{marginRight: 12}}>
                                <Text style={{color: '#A0A0A0'}}>0.5km</Text>
                            </View>
                        </View>
                        <View style={style.reward}>
                            <AntDesign style={{marginRight: 2}} name="star" size={24} color="#FF5353" />
                            <Text style={{marginLeft: 2}}>3.5/5(92)</Text>
                        </View>
                    </View>
                   
                </View>


            </TouchableOpacity>
        );
    }
}

const style = StyleSheet.create({

    item: {
        marginRight: 15
    },

    cardContainer: {
        backgroundColor: '#fff',
        width: 180,
        borderRadius: 10,
    },
    cardImage: {
        height: 180,
        width: '100%',
        borderRadius: 10,
    },
    cardBody: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 13,
    },
    firstInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    attractionName: {
        fontSize: 16,
    },
    reward: {
        flexDirection: 'row',
        alignItems: 'center',
    },


})