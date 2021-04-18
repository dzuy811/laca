import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { REACT_NATIVE_GOOGLE_MAPS_API_KEY } from "@env";
import axios from "axios";

// const REACT_NATIVE_GOOGLE_MAPS_API_KEY = process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY

interface Coordinate {
	latitude: number;
	longitude: number;
}

interface GeoLocation extends Coordinate {
	latitudeDelta: number;
	longitudeDelta: number;
}

interface Props {
	geoLocation: {};
}

type props = {
	attractionCoordinate: any
}

const MapTile: React.FC<props> = (props) => {
	const [geoLocations, setGeoLocations] = useState<GeoLocation[]>();
	const [coordinates, setCoordinates] = useState<Coordinate[]>();
	const [originLat, setOriginLat] = useState<number>(0);
	const [originLon, setOriginLon] = useState<number>(0);
	const [originString, setOrginString] = useState<string>();
	const [destinationString, setDestinationString] = useState<string>();

	const mode = "driving";

	const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${REACT_NATIVE_GOOGLE_MAPS_API_KEY}&mode=${mode}`;

	console.log(REACT_NATIVE_GOOGLE_MAPS_API_KEY)
	// methods defined

	const decode = (t: any, e: any) => {
		for (
			var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5);
			u < t.length;

		) {
			(a = null), (h = 0), (i = 0);
			do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
			while (a >= 32);
			(n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
			do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
			while (a >= 32);
			(o = 1 & i ? ~(i >> 1) : i >> 1), (l += n), (r += o), d.push([l / c, r / c]);
		}

		return (d = d.map(function (t) {
			return {
				latitude: t[0],
				longitude: t[1],
			};
		}));
	};
	// const decode = (t: any,e: any) => {for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}

	// hooks defined
	const fetchAPI = async (url: string) => {
		try {
			let result = await axios.get(url).then((response) => {
				if (response.data.routes.length) {
					setCoordinates(decode(response.data.routes[0].overview_polyline.points, 5));
					console.log("fetched");
				}
			});
			return result;
		} catch (error) {
			console.log(error);
		}
	};

	// const setInitialState = async () => {
	// 	setGeoLocations([
	// 		// origin
	// 		{
	// 			latitude: 10.734327169637687,
	// 			longitude: 106.6536388713616,
	// 			latitudeDelta: 0.0422,
	// 			longitudeDelta: 0.0422,
	// 		},
	// 		// destination
	// 		{
	// 			latitude: 10.777394316429763,
	// 			longitude: 106.65844016839915,
	// 			latitudeDelta: 0.0422,
	// 			longitudeDelta: 0.0422,
	// 		},
	// 	]);
	// 	// initialize coordinates
	// 	setCoordinates([
	// 		{
	// 			latitude: 10.734327169637687,
	// 			longitude: 106.65844016839915,
	// 		},
	// 		{
	// 			latitude: 10.777394316429763,
	// 			longitude: 106.6536388713616,
	// 		},
	// 	]);
	// };

	useEffect( () => {
		console.log('check effect 1')
		navigator.geolocation.getCurrentPosition((position) => {
			var lat = (position.coords.latitude)
			var lon = (position.coords.longitude)
			setOriginLat(lat);
			setOriginLon(lon);
			setOrginString(lat + "," + lon)
			setDestinationString(props.attractionCoordinate.latitude + "," + props.attractionCoordinate.longitude)
		},
		  (error) => alert(JSON.stringify(error)),
		  {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000});
	}, [])

	useEffect(() => {
		console.log('check effect 2')
		fetchAPI(url);
	}, [originString, destinationString]);

	return (
		<View style={styles.container}>
			{coordinates ? (
				<React.Fragment>
					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						showsUserLocation={true}
						region={{
							latitude: originLat,
							longitude: originLon,
							latitudeDelta: 0.0422,
							longitudeDelta: 0.0422,
						}}
					>
						<Marker
                    	coordinate={props.attractionCoordinate}/>
						<Polyline coordinates={[...coordinates]} strokeColor="#2966A3" strokeWidth={4} />
					</MapView>
				</React.Fragment>
			) : (
				// <>
				// 	<Text>Hello {console.log(coordinates)}</Text>
				// </>
				<Text>Loading...</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		position: "absolute",
	},
	map: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		position: "absolute",
	},
});

export default MapTile;
