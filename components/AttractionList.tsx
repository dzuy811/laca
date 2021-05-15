import React from 'react'

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView
} from 'react-native'
import AttractionCard from './AttractionCard'


type attractionType = {
    id: string,
    name: string,
    reward: number,
    ratings: number,
    imageThumbnail: string,
    geoPoint: any,
}

interface AttractionType {
    attractions: attractionType[],
    navigation: any
}

export default class AttractionList extends React.Component<AttractionType> {

    constructor(props: AttractionType) {
        super(props)
    }

    render() {
    
        return (
            <ScrollView style={{width: '100%', backgroundColor: '#fff'}}            >
                <View  style={style.attractionList}>
                    <FlatList
                    contentContainerStyle={{paddingHorizontal: 16}}
                     style={{height: 305, width: '100%', backgroundColor: '#fff'}}
                    showsHorizontalScrollIndicator={false} 
                    data={this.props.attractions}
                    horizontal={true} 
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => 
                        <View style={{width: 16}}/>
                    }
                    renderItem={({item})=> (
                        <AttractionCard navigation={this.props.navigation} data={item}/>
                    )}>

                    </FlatList>
                </View>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    sectionHeading: {
        color: '#4B8FD2',
        fontSize: 20
    },
    attractionList: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})