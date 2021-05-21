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
import {useNavigation} from "@react-navigation/native";
import { database } from "firebase";
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
			distance: number;
			reward: number;
			galleryImage: any[];
		};
	};
	navigation: any;
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
	images: any[];
};
type typeImageData = {
	id: string;
	source: string;
};

type dataDescription = {
	item: descriptionType;
	index?: number;
};

interface uniqueReviews {
	comment: comment;
	userInfo: infoUser;
}

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
	const { latitude, longitude, description, name, id, distance, reward, galleryImage } =
		route.params;
	const [data, setData] = useState<uniqueReviews[]>([]);
	const [userID, setUserID] = useState<any>();
	const [text, setText] = useState<string>("");
	const [deletePost, setDeletePost] = useState<boolean>(false);
	const [newText, setNewText] = useState<string>("");
	const [updatePost, setUpdatePost] = useState<boolean>(false);

	let userContent = "";
	const [dialog, setDialog] = useState<any>(false);
	const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
	const [currentReviewImg, setCurrentReviewImg] = useState<any>("https://i.imgur.com/knFzSA7.png"); // current index of img array in a review // set Default image at initial point
	const [reviewDialog, setReviewDialog] = useState<boolean>(false);

	// fetch list of reviews
	useEffect(() => {
		console.log("id: ", id);
		let url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/attractions/${id}`;
		fetch(url)
			.then((response) => response.json())
			.then((json) => {
				setData(json);
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
		axios
			.post("https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/histories", body)
			.then((res) => {
				console.log(res.data);
				navigation.navigate("Journey Map", {
					// rmit 10.730283804989273, 106.69316143068589
					// home 10.791044000816369, 106.6839532702234
					latitude: latitude,
					longitude: longitude,
					journeyID: res.data.id,
					attractionID: id,
					reward: reward,
				});
			})
			.catch((err) => console.log(err));
	}

	let dataCombination = [] as listData;

	if (data.length > 0) {
		data.forEach((review) => {
			let data = {} as descriptionType;

			// Format the timestamp from date to string
			const timestamp = new Date(review.comment.timeCreated._seconds * 1000);
			const formattedDate = moment(timestamp).format("HH:mm DD-MM-YYYY");

			data.id = review.comment.id;
			data.content = review.comment.content;
			data.avatar = review.userInfo.urlAvatar;
			data.name = review.userInfo.name;
			data.timeCreated = formattedDate;
			data.rating = review.comment.rating;
			data.likeCount = review.comment.likeCount;
			data.replyCount = review.comment.replyCount;
			data.uid = review.userInfo.id;

			// Store the images by index
			if (review.comment.images.length > 0) {
				let imgArray: any = [];
				for (let i = 0; i < review.comment.images.length; i++) {
					let index = i + 1;
					imgArray.push({
						id: index,
						source: review.comment.images[i],
					});
				}
				data.images = imgArray;
			}

			// Take the content of the current user
			if (data.uid == userID) userContent = data.content;

			dataCombination.push(data);
		});
	}

	const ReviewSection = ({ item, index }: dataDescription) => {
        const navigation = useNavigation();
        return (

        
		<View style={{ marginBottom: 10}}>
			{/* Avatar + Name + Rating star + Timestamp */}
			<View style={{ flexDirection: "row" }}>
				<Image source={{uri: item.avatar}} style={styles.profileImage} />
				<View style={{marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<View style={{width: '73%'}}>
						<Text style={styles.profileName}>{item.name != "" ? item.name : ""}</Text>
						<Text style={styles.timeStamp}>{item.timeCreated}</Text>
					</View>
					<View style={{ width: '10%' }}>
						<Rating 
							imageSize={15} 
							readonly 
							startingValue={item.rating} 
							style={styles.rating} 
						/>
					</View>
				</View>

			{/* Up vote + Content */}
			<View style={{marginLeft: 50, marginRight: 30, flexDirection: "row", marginTop: 10}}>
				<View style={{width: '10%',  marginRight: "2%"}}>
					<TouchableOpacity onPress={() => console.log("The up vote test")}>
						<AntDesign name="up" size={35} color={item.likeCount != 0 ? "green" : "black"} />
					</TouchableOpacity>
					<Text style={{ position: "absolute", marginLeft: "40%", paddingTop: 20 }}>{item.likeCount}</Text>
				</View>
                {/* const {id,content,rating,urlAvatar,timeStamp,username,likeCount} = route.params */}

                <TouchableOpacity onPress={() =>{
                    console.log("this review's id:",item.id)
                    navigation.navigate("ReviewScreen",{
                        id :  item.id,
                        content:item.content,
                        rating: item.rating,
                        urlAvatar : item.avatar,
                        timeStamp: item.timeCreated,
                        username:item.name,
                        likeCount:item.likeCount,
                        images:route.params.galleryImage
                    })
                }}>
                    <View style={{ width: '80%'}}>
                        <Text style={{ fontSize: 15 }}>{updatePost && item.uid == userID ? newText : item.content}</Text>				
                    </View>
                </TouchableOpacity>
				
			</View>

			{/* Images */}
			{item.images != undefined ? (
				<View>
					{item.images.length > 0 ? (
						<View style={{ marginLeft: "15%", marginTop: "3%" }}>
							<FlatList
								data={item.images}
								renderItem={renderReviewImage}
								keyExtractor={(item) => item.id}
								horizontal={true} 
								showsHorizontalScrollIndicator={false}
								style={styles.flatListReview}
							/>
						</View>
					) : (
						<>
						</>
					)}
				</View>
			) : (
				<>
				</>
			)}
		</View>
	)}

	// Render list of descriptions for Flat List
	const renderDescription = ({ item, index }: dataDescription) => {
		return (
			<View key={String(index)} style={{ marginBottom: 30 }}>
				{userID == item.uid ? (
					<>
						{deletePost ? (
							<></>
						) : (
							<>
								<TouchableOpacity activeOpacity={0.7} onPress={() => toggleFirstOverlay()}>
									<ReviewSection item={item} index={index} />
								</TouchableOpacity>
								{/* Reply section */}
								<View style={{ marginLeft: "25%", marginBottom: "5%" }}>
									{item.replyCount != 0 ? ( // if the review has reply
										<View>
											<TouchableOpacity onPress={() => console.log("Reply")}>
												<Text style={{ color: "#40D0EF", fontWeight: "bold" }}>
													{" "}
													View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}
												</Text>
											</TouchableOpacity>
										</View>
									) : (
										<></>
									)}
								</View>
								<>
									{/* Horizontal line between each review  */}
									{index != dataCombination.length - 1 ? (
										<View
											style={{
												borderBottomColor: "#EDEDED",
												borderBottomWidth: 1,
												opacity: 0.6,
												position: "relative",
											}}
										/>
									) : (
										<></>
									)}
								</>
							</>
						)}
					</>
				) : (
					<>
						<ReviewSection item={item} />
						{/* Reply section */}
						<View style={{ marginTop: 10, marginLeft: "25%" }}>
							{item.replyCount != 0 ? ( // if the review has reply
								<View>
									<TouchableOpacity onPress={() => console.log("Reply")}>
										<Text style={{ color: "#40D0EF", fontWeight: "bold" }}>
											{" "}
											View all {item.replyCount} comment{item.replyCount == 1 ? "" : "s"}
										</Text>
									</TouchableOpacity>
								</View>
							) : (
								<></>
							)}
						</View>
						<>
							{/* Horizontal line between each review  */}
							{index != dataCombination.length - 1 ? (
								<View
									style={{
										borderBottomColor: "#EDEDED",
										borderBottomWidth: 1,
										opacity: 0.6,
										position: "relative",
									}}
								/>
							) : (
								<></>
							)}
						</>
					</>
				)}
			</View>
		);
	};

	// Render list of images for Flat List
	const renderGalleryImage = ({ item, index }: any) => {
		return (
			<TouchableOpacity>
				<Image key={index} source={{ uri: item }} style={styles.galleryImageStyle} />
			</TouchableOpacity>
		);
	};

	const renderReviewImage = ({ item, index }: any) => {
		return (
			<TouchableOpacity
				key={index.toString()}
				onPress={() => {
					setCurrentReviewImg(item.source);
					toggleReviewDialogOverlay();
				}}
			>
				<Image key={index} source={{ uri: item.source }} style={styles.reviewImageStyle} />
			</TouchableOpacity>
		);
	};
	const renderImage = ({ item, index }: any) => {
		return (
			<TouchableOpacity
				key={index.toString()}
				onPress={() => {
					setCurrentImgIndex(index);
					toggleDialogOverlay();
				}}
			>
				<Image source={{ uri: item }} style={styles.galleryImageStyle}></Image>
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

	const toggleReviewDialogOverlay = () => {
		setReviewDialog(!reviewDialog);
	};

	function getCurrentUser(): any {
		for (let i = 0; i < dataCombination.length; i++) {
			if (dataCombination[i].uid == userID) return dataCombination[i];
		}
		return {};
	}

	function getCurrentUserIndex(): number {
		for (let i = 0; i < dataCombination.length; i++) {
			if (dataCombination[i].uid == userID) return i;
		}
		return 0;
	}

	return (
		<>
			<View style={{ flex: 1 }}>
				{/* Header */}
				<AnimatedHeader
					animatedValue={offset}
					navigation={navigation}
					headerName={name}
					headerDistance={distance}
				/>

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
									data={galleryImage}
									renderItem={renderImage}
									keyExtractor={(item: any, index: number) => index.toString()}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
									style={styles.flatListGallery}
								/>
							</View>

							{/* Reviews */}
							<View style={{ paddingBottom: 100 }}>
								<Text style={styles.descriptionTitle}>Reviews</Text>
								<FlatList
									data={dataCombination.reverse()}
									renderItem={renderDescription}
									keyExtractor={(item: any, index: number) => index.toString()}
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
								<TouchableOpacity
									style={{ padding: 5 }}
									onPress={() => {
										let url =
											"https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/" +
											getCurrentUser().id;
										axios
											.delete(url)
											.then((res) => {
												console.log(res.data);
											})
											.catch((err) => console.log(err.response.data));
										dataCombination.splice(getCurrentUserIndex(), 1);
										setVisible1(false);
										setDeletePost(true);
									}}
								>
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
								style={{ height: 100 }}
								placeholder="Type here!"
								onChangeText={(text) => {
									setText(text);
								}}
								defaultValue={!updatePost ? userContent : newText}
								multiline={true}
								numberOfLines={8}
							/>
							<Pressable
								style={styles.submitButton}
								onPress={() => {
									let body = {
										content: text,
									};
									let url =
										"https://asia-east2-laca-59b8c.cloudfunctions.net/api/reviews/" +
										getCurrentUser().id;
									axios
										.put(url, body)
										.then((res) => {
											console.log(res.data);
										})
										.catch((err) => console.log(err.response.data));
									userContent = text;
									dataCombination[getCurrentUserIndex()].content = text;
									setNewText(text);
									setUpdatePost(true);
									setVisible2(false);
								}}
							>
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
										uri: galleryImage[currentImgIndex],
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
				{/* Modal for Zooming Image*/}
				<View key={"PopUpReviewImage"}>
					<Overlay
						isVisible={reviewDialog}
						onBackdropPress={() => toggleReviewDialogOverlay()}
						animationType="slide"
						overlayStyle={{
							position: "relative",
							width: 400,
							height: 400,
							backgroundColor: "#fff",
						}}
					>
						<ImageZoom
							cropWidth={370}
							cropHeight={370}
							imageWidth={370}
							imageHeight={370}
							style={{ left: 5, marginTop: 5 }}
							enableDoubleClickZoom={false}
						>
							{currentReviewImg !== null && typeof currentReviewImg !== "undefined" ? (
								<Image
									style={{ width: 380, height: 380 }}
									source={{
										// renderImage
										uri: currentReviewImg,
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
	galleryImageStyle: {
		marginRight: 30,
		height: 220,
		width: 150,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	reviewImageStyle: {
		marginRight: 20,
		height: 160,
		width: 100,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	flatListGallery: {
		height: 250,
		flexGrow: 0,
	},
	flatListReview: {
		height: 160,
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
