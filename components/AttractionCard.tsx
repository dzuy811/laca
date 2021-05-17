import React, { Component, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	TouchableHighlightBase,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

type attractionType = {
	id: string;
	name: string;
	reward: number;
	ratings: number;
	imageThumbnail: string;
	geoPoint: any;
	description?: string;
	galleryImage: any[]
};

interface CardProps {
	data: attractionType;
	navigation: any;
}

export default class AttractionCard extends Component<CardProps> {
	constructor(props: CardProps) {
		super(props);
	}

	componentDidMount() {
		
	}

	render() {
		// Store the gallery images by index
		if(this.props.data.galleryImage != []) {
			if(this.props.data.galleryImage.length > 0) {
				let imgArray:any = [];
				for(let i = 0; i < this.props.data.galleryImage.length; i++) {
					let index = i + 1;
					imgArray.push({
						"id": index,
						"source": this.props.data.galleryImage[i]
					})
				}
				this.props.data.galleryImage = imgArray;
			}
		}
		return (
			<TouchableOpacity
				onPress={() => {
					this.props.navigation.navigate("Attraction detail", {
						id: this.props.data.id,
						latitude: this.props.data.geoPoint._latitude,
						longitude: this.props.data.geoPoint._longitude,
						description: this.props.data.description,
						name: this.props.data.name,
						galleryImage: this.props.data.galleryImage
					}); // Navigate to the attraction description tab
					// Passing the latitude and longitude props
				}}
				activeOpacity={0.8}
				style={[style.cardContainer, style.item]}
			>
				<View>
					<Image style={style.cardImage} source={{ uri: `${this.props.data.imageThumbnail}` }} />
				</View>
				<View style={style.cardBody}>
					<View>
						<Text numberOfLines={1} style={style.attractionName}>
							{this.props.data.name}
						</Text>
					</View>
					<View style={{ marginTop: 10 }}>
						<View style={style.firstInfo}>
							<View style={[style.reward]}>
								<FontAwesome5 style={{ marginRight: 2 }} name="coins" size={24} color="#E2D0A2" />
								<Text style={{ marginLeft: 2, fontSize: 18 }}>{this.props.data.reward}</Text>
							</View>
							<View style={{ marginRight: 12 }}>
								<Text style={{ color: "#A0A0A0", fontSize: 16 }}>6.9km</Text>
							</View>
						</View>
						<View style={style.reward}>
							<AntDesign style={{ marginRight: 2 }} name="star" size={24} color="#FF5353" />
							<Text style={{ marginLeft: 2, fontSize: 18 }}>3.5/5(92)</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const style = StyleSheet.create({
	item: {
		marginRight: 15,
	},

	cardContainer: {
		backgroundColor: "#fff",
		width: 350,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	cardImage: {
		height: 360,
		width: "100%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	cardBody: {
		paddingTop: 15,
		paddingLeft: 25,
		paddingRight: 10,
		paddingBottom: 30,
	},
	firstInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	attractionName: {
		fontSize: 24,
	},
	reward: {
		flexDirection: "row",
		alignItems: "center",
	},
});
