import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import AttractionList from "../components/AttractionList";

type homeScreenProps = {
	data: any[];
	navigation: any;
};

export class HomeScreen extends Component<homeScreenProps> {
	state: homeScreenProps = {
		data: [],
		navigation: "",
	};

	componentDidMount() {
		fetch("https://asia-east2-laca-59b8c.cloudfunctions.net/api/attractions")
			.then((response) => response.json())
			.then((json) => {
				this.setState({ data: json });
				console.log(this.state.data);
			})
			.catch((err) => console.error(err));
	}

	render() {
		const data = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
				<View style={style.header}>
					<View>
						<Text style={{ marginLeft: 10, fontSize: 18, color: "#fff" }}>702 Nguyen Van Linh</Text>
					</View>
				</View>
				<View style={style.cardList}>
					<AttractionList navigation={this.props.navigation} attractions={this.state.data} />
				</View>
			</View>
		);
	}
}

const style = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: "#4B8FD2",
		height: 100,
		alignItems: "center",
	},
	sectionHeading: {
		color: "#4B8FD2",
	},
	cardList: {
		marginLeft: 20,
		marginTop: 100,
		alignItems: "stretch",
		justifyContent: "center",
	},
});

export default HomeScreen;
