import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

const fb_logo = require("../assets/fb_logo.png");
const gg_logo = require("../assets/gg_logo.jpg");

interface Props {
	title: string;
	onPress: () => void;
}

const RoundedImage: FC<Props> = (props) => {
	return (
		<TouchableHighlight activeOpacity={0.6} style={styles.imgContainer} onPress={props.onPress}>
			<Image
				style={styles.image}
				source={props.title == "FB" ? fb_logo : gg_logo}
				resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
			/>
		</TouchableHighlight>
	);
};

export default RoundedImage;

const styles = StyleSheet.create({
	imgContainer: {
		marginLeft: 8,
		height: 40,
		width: 40,
		borderRadius: 40,
		borderWidth: 1,
		shadowOpacity: 1,
		borderColor: "transparent",
		marginBottom: 20,
	},
	image: {
		height: 40,
		width: 40,
		borderRadius: 40,
	},
});
