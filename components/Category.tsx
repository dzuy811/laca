import React from 'react'
import { Text, View, Image, ImageSourcePropType, StyleSheet } from 'react-native'

type props = {
    bgColor: string,
    name: string,
    image: ImageSourcePropType
}

const Category:React.FC<props> = (props) => {


    return (
        <View style={[styles.categoryContainer, {backgroundColor: `${props.bgColor}`}]}>
            <Image
                source={props.image}
                style={{ width: 40, height: 40, tintColor: '#fff' }}

            />
            <Text style={{ color: '#fff', marginTop: 8 }}>{props.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryContainer: {
        width: 100, 
        height: 100, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#e0e0e0',
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 2,
    }
})

export default Category