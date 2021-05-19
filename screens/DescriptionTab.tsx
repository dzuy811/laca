import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	FlatList,
	Animated,
	TouchableOpacity,
	TextInput,
	Pressable,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { Rating, Overlay } from "react-native-elements";
import { LoginButton } from "../components";
import AnimatedHeader from "../components/AnimatedHeader";
import axios from "axios";
import { getData } from "../constants/utility";
import ImageZoom from "react-native-image-pan-zoom";

type iItem = {
	item: typeImageData;
	index: number;
};

type Props = {
	route: {
		params: {
			latitude: number;
			longitude: number;
			description: string;
			name: string;
			id: string;
		};
	};
	navigation: any;
};

type typeImageData = {
	id: string;
	source: string;
};

type descriptionType = {
	id: string;
	uid: string;
	name: string;
	avatar: string;
	content: string;
	timeCreated: string;
	rating: number;
	likeCount: number;
	replyCount: number;
};

type dataDescription = {
	item: descriptionType;
	index?: number;
};

interface uniqueReviews {
	comment: comment;
	userInfo: infoUser;
}

// Mock data for Gallery Pictures
const Data = [
	{
		id: "01",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "02",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "03",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "04",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
	{
		id: "05",
		source: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ben-nha-rong-chua.jpg",
	},
];

type comment = {
	id: string;
	timeCreated: any;
	likeCount: number;
	images: string[];
	uid: any;
	content: string;
	aid: string;
	rating: number;
	replyCount: number;
};

type infoUser = {
	id: string;
	gender: string;
	address: string[];
	name: string;
	phoneNumber: string;
	friendsCount: number;
	totalReward: number;
	journeyCount: number;
	urlAvatar: string;
};

type listData = descriptionType[];

const DescriptionTab = ({ route, navigation }: Props) => {
	const offset = useRef(new Animated.Value(0)).current;
	const { latitude, longitude, description, name, id } = route.params;
	const [data, setData] = useState<uniqueReviews[]>([]);
	const [userID, setUserID] = useState<any>();
	const [text, setText] = useState<string>("");
	let userContent = "";
	const [dialog, setDialog] = useState<any>(false);
	const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

	// fetch list of reviews
	useEffect(() => {
		fetch(`https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/attractions/${id}`)
			.then((response) => response.json())
			.then((json) => {
				setData(json);
				console.log(json);
				getUser().then((data) => setUserID(data));
			})
			.catch((err) => console.error(err));
	}, []);

	async function getUser() {
		let id = await getData("id");
		return id;
	}

	async function takeJourney() {
		let body = {
			userID: await getData("id"),
			attractionID: id,
		};
		console.log(body);

		axios
			.post("https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/histories", body)
			.then((res) => {
				console.log(res.data);
				navigation.navigate("Journey Map", {
					latitude: latitude,
					longitude: longitude,
				});
			})
			.catch((err) => console.log(err));
	}

	let dataPoint = 0;
	let dataCombination = [] as listData;

	data.forEach((review) => {
		let data = {} as descriptionType;

		// Format the timestamp from date to string
		const timestamp = new Date(review.comment.timeCreated._seconds * 1000);
		const formattedDate = moment(timestamp).format("HH:mm DD-MM-YYYY");

		data.id = dataPoint.toString();
		data.content = review.comment.content;
		data.avatar = review.userInfo.urlAvatar;
		data.name = review.userInfo.name;
		data.timeCreated = formattedDate;
		data.rating = review.comment.rating;
		data.likeCount = review.comment.likeCount;
		data.replyCount = review.comment.replyCount;
		data.uid = review.userInfo.id;

		// Take the content of the current user
		if (data.uid == userID) userContent = data.content;

		dataCombination.push(data);
	});

	const ReviewSection = ({ item }: dataDescription) => (
		<View style={{ marginBottom: 10 }}>
			<View style={{ flexDirection: "row" }}>
				<Image source={{ uri: item.avatar }} style={styles.profileImage} />
				<View
					style={{
						marginLeft: 10,
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "flex-start",
					}}
				>
					<View style={{ width: "73%" }}>
						<Text style={styles.profileName}>{item.name}</Text>
						<Text style={styles.timeStamp}>{item.timeCreated}</Text>
					</View>
					<View style={{ width: "10%" }}>
						<Rating imageSize={15} readonly startingValue={item.rating} style={styles.rating} />
					</View>
				</View>
			</View>
			<View style={{ marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10 }}>
				<View style={{ width: "10%", marginRight: "2%" }}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={35} color={item.likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", marginLeft: "40%", paddingTop: 20 }}>
						{item.likeCount}
					</Text>
				</View>
				<View style={{ width: "80%" }}>
					<Text style={{ fontSize: 15 }}>{item.content}</Text>
				</View>
			</View>
		</View>
	);

	// Render list of descriptions for Flat List
	const renderDescription = ({ item, index }: dataDescription) => (
		<View key={index} style={{ marginBottom: 30 }}>
			{userID == item.uid ? (
				<>
					<TouchableOpacity activeOpacity={0.7} onPress={() => toggleFirstOverlay()}>
						<ReviewSection item={item} />
					</TouchableOpacity>
					{/* Reply section */}
					<View style={{ marginLeft: "25%" }}>
						{item.replyCount == 0 ? ( // if there is not any reply
							<View></View>
						) : (
							<View style={{}}>
								<TouchableOpacity
									onPress={() =>
										// console.log(navigation),

										navigation.navigate(
											"ReviewScreen",
											{
												id: item.id,
												content: item.content,
												rating: item.rating,
												urlAvatar: item.avatar,
												timestamp: item.timeCreated,
												username: item.name,
												likeCount: item.likeCount,
											}
											// console.log(item.id),

											// console.log("Reply")
										)
									}
								>
									<Text style={{ color: "#40D0EF", fontWeight: "bold" }}>
										{" "}
										View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</>
			) : (
				<>
					<ReviewSection item={item} />
					{/* Reply section */}
					<View style={{ marginTop: 10, marginLeft: "25%" }}>
						{item.replyCount == 0 ? ( // if there is not any reply
							<View></View>
						) : (
							<View style={{}}>
								<TouchableOpacity onPress={() => console.log("Reply")}>
									<Text style={{ color: "#40D0EF", fontWeight: "bold" }}>
										{" "}
										View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</>
			)}
		</View>
	);

	// Render list of images for Flat List
	const renderImage = ({ item, index }: iItem) => {
		return (
			<TouchableOpacity
				key={index}
				onPress={() => {
					setCurrentImgIndex(index);
					toggleDialogOverlay();
				}}
			>
				<Image source={{ uri: item.source }} style={styles.imageStyle}></Image>
			</TouchableOpacity>
		);
	};

	const [visible1, setVisible1] = useState(false);
	const [visible2, setVisible2] = useState(false);

	const toggleFirstOverlay = () => {
		setVisible1(!visible1);
	};

	const toggleSecondOverlay = () => {
		setVisible2(!visible2);
	};

	const toggleDialogOverlay = () => {
		setDialog(!dialog);
	};

	return (
		<>
			<View style={{ flex: 1 }}>
				{/* Header */}
				<AnimatedHeader animatedValue={offset} navigation={navigation} headerName={name} />

				<View style={{ flex: 1, backgroundColor: "white" }}>
					<View>
						<Animated.ScrollView
							style={{ backgroundColor: "white" }}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{}}
							scrollEventThrottle={16}
							onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], {
								useNativeDriver: false,
							})}
						>
							{/* Description */}
							<Text style={styles.descriptionTitle}>Description</Text>
							<Text style={styles.descriptionBox}>{description}</Text>

							{/* Gallery */}
							<Text style={styles.descriptionTitle}>Gallery</Text>
							<View style={{ marginLeft: "10%" }}>
								<FlatList
									data={Data}
									renderItem={renderImage}
									keyExtractor={(item) => item.id.toString()}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
									style={styles.flatList}
								/>
							</View>

							{/* Reviews */}
							<View style={{ paddingBottom: 100 }}>
								<Text style={styles.descriptionTitle}>Reviews</Text>
								<FlatList
									data={dataCombination.reverse()}
									renderItem={renderDescription}
									keyExtractor={(item) => item.id}
								></FlatList>
							</View>
						</Animated.ScrollView>
					</View>
				</View>

				{/* Journey Starting Button */}
				<LinearGradient
					colors={["rgba(255,255,355,0.02)", "rgba(255,255,355,1)"]}
					style={{
						position: "absolute",
						alignItems: "center",
						marginTop: "0%",
						left: 0,
						right: 0,
						bottom: 0,
						marginBottom: 0,
						zIndex: 2,
					}}
				>
					<LoginButton
						title="Take the journey"
						onPress={() => takeJourney()}
						color="#4B8FD2"
						textColor="#E2D0A2"
					/>
				</LinearGradient>

				{/* Modal for editing/deleting */}
				<View style={{ position: "absolute", bottom: 0 }}>
					<View style={{ position: "absolute", bottom: 0 }}>
						<Overlay
							isVisible={visible1}
							onBackdropPress={() => toggleFirstOverlay()}
							animationType="slide"
							overlayStyle={{ position: "absolute", bottom: 20, width: "100%" }}
						>
							<View>
								<TouchableOpacity
									style={{ padding: 5 }}
									onPress={() => {
										toggleSecondOverlay();
										setVisible1(false);
									}}
								>
									<Text style={styles.textOverlap}>Edit</Text>
								</TouchableOpacity>
								<View style={{ borderBottomColor: "#828282", borderBottomWidth: 1 }} />
								<TouchableOpacity style={{ padding: 5 }} onPress={() => console.log("Delete")}>
									<Text style={styles.textOverlap}>Delete</Text>
								</TouchableOpacity>
							</View>
						</Overlay>
					</View>
				</View>
				{/* Modal for editing the post */}
				<View>
					<Overlay
						isVisible={visible2}
						onBackdropPress={() => toggleSecondOverlay()}
						animationType="slide"
						overlayStyle={{ position: "absolute", bottom: 40, width: "100%" }}
					>
						<View style={{ alignItems: "center" }}>
							<TextInput
								style={{ height: 50, textAlign: "auto" }}
								placeholder="Type here!"
								onChangeText={(text) => setText(text)}
								defaultValue={userContent}
							/>
							<Pressable style={styles.submitButton} onPress={() => alert("hello world")}>
								<Text style={{ color: "#E2D0A2" }}>Submit</Text>
							</Pressable>
						</View>
					</Overlay>
				</View>
				{/* Modal for Zooming Image*/}
				<View key={"PopUpImage"}>
					<Overlay
						isVisible={dialog}
						onBackdropPress={() => toggleDialogOverlay()}
						animationType="slide"
						overlayStyle={{
							position: "relative",
							width: 400,
							height: 400,
							backgroundColor: "#fff",
						}}
					>
						{console.log("Popped Up!")}
						<ImageZoom
							cropWidth={370}
							cropHeight={370}
							imageWidth={370}
							imageHeight={370}
							style={{ left: 5, marginTop: 5 }}
							enableDoubleClickZoom={false}
						>
							{currentImgIndex !== null && typeof currentImgIndex !== "undefined" ? (
								<Image
									style={{ width: 380, height: 380 }}
									source={{
										// renderImage
										uri: Data[currentImgIndex].source,
									}}
								/>
							) : (
								<>
									<ActivityIndicator size="small" color="#0000ff" />
								</>
							)}
						</ImageZoom>
					</Overlay>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	header: {
		position: "relative",
		height: 200,
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: "#4B8FD2",
		borderBottomRightRadius: 30,
		borderBottomLeftRadius: 30,
	},
	descriptionTitle: {
		marginTop: "4%",
		fontSize: 25,
		marginLeft: "10%",
		color: "rgb(211,184,115)",
		paddingBottom: "2%",
	},
	descriptionBox: {
		paddingBottom: "5%",
		paddingRight: "10%",
		paddingLeft: "10%",
		fontSize: 14,
		textAlign: "left",
	},
	imageStyle: {
		marginRight: 30,
		height: 220,
		width: 150,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	flatList: {
		height: 250,
		flexGrow: 0,
	},
	profileImage: {
		marginLeft: 30,
		height: 40,
		width: 40,
		borderRadius: 40,
		overflow: "hidden",
	},
	profileName: {
		fontSize: 16,
		fontWeight: "400",
	},
	timeStamp: {
		fontSize: 12,
		color: "#959595",
		fontWeight: "400",
	},
	rating: {
		paddingVertical: 10,
		justifyContent: "flex-end",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		position: "absolute",
		bottom: 0,
		marginTop: 22,
	},
	overlay: {
		paddingVertical: 15,
		position: "absolute",
		paddingHorizontal: 20,
		width: "86%",
	},
	textOverlap: {
		position: "relative",
		fontSize: 20,
		textAlign: "center",
		color: "#828282",
	},
	submitButton: {
		width: 300,
		padding: 20,
		backgroundColor: "#4B8FD2",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#fff",
		alignItems: "center",
		marginBottom: 20,
	},
});

export default DescriptionTab;
