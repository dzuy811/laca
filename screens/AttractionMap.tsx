import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions} from 'react-native'
import MapView, { Marker } from 'react-native-maps';

type attractionMapTypes = {
    userPosition: {
        latitude: number,
        logitude: number,
        latitudeDelta: number,
        longitudeDelta: number
    },
    attractionPosition: {
      latitude: number,
      longitude: number
    },
    route: any
}


const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class AttractionMap extends Component<attractionMapTypes> {

        state = {
            userPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
              },
              attractionPosition: {
                latitude: this.props.route.params.latitude,
                longitude: this.props.route.params.longitude
              }
        }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
          var lat = (position.coords.latitude)
          var long = (position.coords.longitude)
          console.log("Latitude: ")
          console.log(this.state.attractionPosition.latitude)
          var userPosition = {
            latitude: lat,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
    
          this.setState({userPosition: userPosition})
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      }


    render() {
        return (
            <View style={styles.container}>
                <MapView
                style={styles.map}
                showsUserLocation={true}
                region={this.state.userPosition}
                >
                    <Marker
                    coordinate={this.state.attractionPosition}/>
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });