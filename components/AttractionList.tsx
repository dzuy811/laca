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
    imageThumbnail: string
}

interface AttractionType {
    attractions: attractionType[]
}

export default class AttractionList extends React.Component<AttractionType> {

    constructor(props: AttractionType) {
        super(props)
    }

    render() {
        return (
            <ScrollView>
                <View>
                    <Text style={style.sectionHeading}>Local Attractions</Text>
                </View>
                <View style={{marginTop: 10}}>
                    <FlatList
                    showsHorizontalScrollIndicator={false} 
                    data={this.props.attractions}
                    horizontal={true} 
                    keyExtractor={item => item.id}
                    renderItem={({item})=> (
                        <AttractionCard data={item}/>
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
    }
})