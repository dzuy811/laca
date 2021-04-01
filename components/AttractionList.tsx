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
    ratings: number
}

interface AttractionType {
    attraction: attractionType[]
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
                <View>
                    <FlatList 
                    data={this.props.attraction}
                    horizontal={true} 
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
        color: '#4B8FD2'
    }
})