import React, { Component, useState, useEffect, JSXElementConstructor } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { Header } from 'react-native-elements'

import AttractionList from '../components/AttractionList'

type homeScreenProps = {
    data: any[],
    navigation: any,
    address: any
}

const HomeScreen:React.FC<homeScreenProps> = ({address,data,navigation}, props) => {

    const item  = address
    console.log(navigation)

    return (
        <View style={{flex: 1, backgroundColor: '#FCFCFC'}}>
                <Header
                leftComponent={
                    <Text style={{color: '#fff'}}>{item}</Text>
                }
                leftContainerStyle={{flex:4}}
                />
                <View style={style.cardList}>
                    <AttractionList navigation={navigation} attractions={data}/>
                </View>
                
        </View>
    )
}

export default HomeScreen

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 100,
        alignItems: 'center'
    },
    sectionHeading: {
        color: '#4B8FD2'
    },
    cardList: {
        marginLeft: 20,
        marginTop: 100,
        alignItems: 'stretch',
        justifyContent: 'center'
    }
})
