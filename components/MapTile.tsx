import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import axios from "axios";
import * as Svg from "react-native-svg";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface Coordinate {
	latitude: number;
	longitude: number;
}

interface Props {
	startGeoLocation: string;
	finishGeoLocation: string;
	navigation?: any;
}

const MapTile: React.FC<Props> = ({ startGeoLocation, finishGeoLocation, navigation }) => {
	const [coordinates, setCoordinates] = useState<Coordinate[]>();

	const mode = "driving";

	// fetch Google's Map API for routes and navigations
	useEffect(() => {
		let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startGeoLocation}&destination=${finishGeoLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}&mode=${mode}`;
		fetchAPI(url);
	}, []);

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

	// hooks defined
	const fetchAPI = async (url: string) => {
		console.log(url);
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

	// function to calculate suitable delta of latitude and longtiude for map's view
	const regionContainingPoints = (points: any) => {
		let minLat: number, maxLat: number, minLng: number, maxLng: number;

		// init first point
		((point) => {
			minLat = point.latitude;
			maxLat = point.latitude;
			minLng = point.longitude;
			maxLng = point.longitude;
		})(points[0]);

		// calculate rect
		points.forEach((point: { latitude: number; longitude: number }) => {
			minLat = Math.min(minLat, point.latitude);
			maxLat = Math.max(maxLat, point.latitude);
			minLng = Math.min(minLng, point.longitude);
			maxLng = Math.max(maxLng, point.longitude);
		});

		const midLat = (minLat + maxLat) / 2;
		const midLng = (minLng + maxLng) / 2;

		const deltaLat = maxLat - minLat + 0.0092;
		const deltaLng = maxLng - minLng + 0.0092;

		return {
			latitude: midLat,
			longitude: midLng,
			latitudeDelta: deltaLat,
			longitudeDelta: deltaLng,
		};
	};

	// map coords to appropriate delta value
	const region = regionContainingPoints([
		{
			latitude: parseFloat(startGeoLocation.split(",")[0]),
			longitude: parseFloat(startGeoLocation.split(",")[1]),
		},
		{
			latitude: parseFloat(finishGeoLocation.split(",")[0]),
			longitude: parseFloat(finishGeoLocation.split(",")[1]),
		},
	]);

	return (
		<View style={styles.container}>
			{coordinates ? (
				<React.Fragment>
					<MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={region}>
						<Polyline coordinates={[...coordinates]} strokeColor="#2966A3" strokeWidth={4.5} />
						<Marker
							coordinate={{
								latitude: parseFloat(startGeoLocation.split(",")[0]),
								longitude: parseFloat(startGeoLocation.split(",")[1]),
							}}
							pinColor={"#4B8FD2"}
						/>
						<Marker
							coordinate={{
								latitude: parseFloat(finishGeoLocation.split(",")[0]),
								longitude: parseFloat(finishGeoLocation.split(",")[1]),
							}}
						/>
					</MapView>
				</React.Fragment>
			) : (
				<ActivityIndicator size="large" color="#2966A3" />
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
		...StyleSheet.absoluteFillObject,
		// flex: 1,
		// width: windowWidth,
		// height: windowHeight,
		// zIndex: -1,
	},
});

export default MapTile;
