const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const Cors = require("cors");
const app = express().use(Cors({ origin: true }));

admin.initializeApp();

/* LIST OF STATUS CODES AND ITS USAGE 
	200: Request was processed and sent successfully, reponse was also returned correctly
	400: Bad request, incorrect syntax, information provided to the body of the request
*/

// ---- API for Attraction Collection ----- //
app.get("/attractions", (req, res) => {
	admin
		.firestore()
		.collection("attractions")
		.get()
		.then((data) => {
			let attractions = [];
			data.forEach((doc) => {
				attractions.push({
					id: doc.id,
					...doc.data(),
				});
			});
			return res.json(attractions);
		})
		.catch((error) => {
			console.log("Error: ", error);
		});
});

// tested
app.post("/attractions", (req, res) => {
	const newAttraction = {
		description: req.body.description,
		imageThumbnail: req.body.imageThumbnail,
		reward: req.body.reward,
		name: req.body.name,
		geoPoint: new admin.firestore.GeoPoint(
			req.body.geoPoint["lattitude"],
			req.body.geoPoint["longitude"]
		),
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
	};

	admin
		.firestore()
		.collection("attractions")
		.add(newAttraction)
		.then((doc) => {
			res.json({
				message: `Attraction ${doc.id} created successfully.`,
			});
		})
		.catch((error) => {
			res.status(400).json({
				message: `ERROR 400`,
			});
			console.error(error);
		});
});

app.delete("/attractions/:id", async (req, res) => {
	try {
		const db = admin.firestore();

		const attractionRef = db.collection("attractions").doc(req.params.id);

		if (typeof attractionRef == "undefined") {
			return res.status(400).json({
				message: "ERROR 400",
			});
		}
		attractionRef.delete();
		return res.status(200).json({
			message: `Attraction document ${attractionRef.id} deleted successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

// tested
app.get("/attractions/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("attractions")
			.where("__name__", "==", `${req.params.id}`)
			.get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction);
		}
		return res.json({ error: "haizza " });
	} catch (err) {
		console.log(err);
	}
});

// tested
app.put("/attractions/:id", (req, res) => {
	admin
		.firestore()
		.collection("attractions")
		.doc(req.params.id)
		.update({
			count: admin.firestore.FieldValue.increment(req.body.num),
			name: req.body.name,
			description: req.body.description,
			rating: req.body.rating,
		})
		.then((doc) => {
			res.json({
				message: `document ${doc.id} updated successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
				message: "problem occcured",
			});
			console.error(err);
		});
});

//

// tested
app.get("/attractions/pages/:page", (req, res) => {
	const begin = req.params.page - 1;
	const pagesize = 3;
	const end = req.params.page;
	admin
		.firestore()
		.collection("attractions")
		.get()
		.then((data) => {
			let i = 0;
			let attractions = [];
			data.forEach((doc) => {
				if (i >= begin * pagesize && i <= end * pagesize) {
					attractions.push({
						id: doc.id,
						...doc.data(),
					});
				}
				i++;
			});
			console.log(begin * pagesize);
			console.log(end * pagesize);
			return res.json(attractions);
		})
		.catch((err) => {
			console.error(err);
		});
});

// ---- API for User Collection ----- //
// Get ALL Users
app.get("/users", (req, res) => {
	admin
		.firestore()
		.collection("users")
		.get()
		.then((data) => {
			let users = [];
			data.forEach((doc) => {
				users.push({
					id: doc.id,
					...doc.data(),
				});
			});
			return res.json(users);
		})
		.catch((error) => {
			res.status(400).json({
				message: `ERROR 400`,
			});
			console.log(error);
		});
});

// Get ONE User
app.get("/users/:id", async (req, res) => {
	try {
		// Declare DB reference
		const db = admin.firestore();

		// Reference to collection of the user
		const userSnapshot = await db.collection("users").doc(req.params.id).get();
		const user = {
			id: userSnapshot.id,
			...userSnapshot.data(),
		};

		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
	}
});

// Search user by phone
app.get("/users/search/details", async (req, res) => {
	try {
		// create reference for User collection on Firestore
		const usersRef = admin.firestore().collection("users");
		const country = "Vietnam";
		let phone;

		// Normalize Vietnam's phone format for international code format
		if (country == "Vietnam") {
			phone = "+84" + req.query.phone.replace("0", "");
			console.log(phone);
		}

		// Query for finding users by phone's number
		const searchQuery = await usersRef.where("phoneNumber", "==", phone).get();
		if (searchQuery.empty) {
			console.log(req.query.phone);
			res.status(200).json({});
			return;
		}
		const searchUser = searchQuery.docs[0];
		let user = {
			id: searchUser.id,
			...searchUser.data(),
		};

		return res.json(user);
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

// ======== FRIENDSHIP ========
// Get all friends of a user
app.get("/users/:id/friendships", async (req, res) => {
	try {
		// Declare DB Firebase
		const db = admin.firestore();

		// Retrieve user's reference
		const userRef = db.doc("users/" + req.params.id);
		const user = await userRef.get();

		// Retrieve friendship reference from collections
		const friendshipSnapshot = await db
			.collection("friendships")
			.where("user", "==", userRef)
			.get();

		if (friendshipSnapshot.empty) {
			console.log("Empty Friendship for User's ID", userRef.id);
			return res.status(200).json([]);
		}

		let response = [];
		for await (let friendship of friendshipSnapshot.docs) {
			let fsSnapshot = await friendship.data().otherUser.get();
			response.push({
				user: {
					id: fsSnapshot.id,
					...fsSnapshot.data(),
				},
				createdAt: friendship.data().createdAt,
			});
		}
		return res.json({
			friendsCount: user.data().friendsCount,
			friends: response,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Get Friendship betweeen two users
app.get("/friendships/get", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();
		// Acquire query route
		const { userID, otherUserID } = req.query;
		// Reference to user collection
		const userRef = db.doc("users/" + userID);
		const otherUserRef = db.doc("users/" + otherUserID);

		const friendShipQuery_1 = await db
			.collection("friendships")
			.where("user", "==", userRef)
			.where("otherUser", "==", otherUserRef)
			.get();
		const friendShipQuery_2 = await db
			.collection("friendships")
			.where("user", "==", otherUserRef)
			.where("otherUser", "==", userRef)
			.get();

		const or_array = friendShipQuery_1.docs.concat(friendShipQuery_2.docs);

		if (or_array.length <= 0) {
			throw new Error("No friendship has been found");
		}
		const friendshipDoc = or_array[0];
		const friendshipDocUser = await friendshipDoc.data().user.get();
		const friendshipDocOtherUser = await friendshipDoc.data().otherUser.get();
		return res.status(200).json({
			id: friendshipDoc.id,
			createdAt: friendshipDoc.data().createdAt,
			user: friendshipDocUser.data(),
			otherUser: friendshipDocOtherUser.data(),
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Unfriend method
app.delete("/friendships/:id/remove", async (req, res) => {
	try {
		// Declare DB reference
		const db = admin.firestore();
		const friendshipID = req.params.id;

		// Declare reference
		const fsRef = db.collection("friendships").doc(friendshipID);
		const fsSnapshot = await fsRef.get();
		const userRef = fsSnapshot.data().user;
		const otherUserRef = fsSnapshot.data().otherUser;
		const frRef = fsSnapshot.data().friendRequest;

		// check existance
		if (!fsRef && typeof fsRef === "undefined" && !frRef && typeof frRef === "undefined") {
			throw new Error(
				"Friendship & FriendRequest References not found, please check your ID again"
			);
		}

		await fsRef.delete(); // delete friendship
		await frRef.delete(); // delete attached friendRequest
		const dbTransaction = db.runTransaction((t) => {
			return t.getAll(userRef, otherUserRef).then((docs) => {
				let user = docs[0];
				let otherUser = docs[1];

				// Read current count values of user and otherUser
				let currentUserCount = user.data().friendsCount;
				let currentOtherUserCount = otherUser.data().friendsCount;

				// Perform update operations
				if (currentUserCount == 0 || typeof currentUserCount === "undefined" || !currentUserCount) {
					throw new Error("User does not have any friends!");
				} else {
					t.update(userRef, {
						friendsCount: currentUserCount - 1,
					});
				}

				if (
					currentOtherUserCount == 0 ||
					typeof currentOtherUserCount === "undefined" ||
					!currentOtherUserCount
				) {
					throw new Error("OtherUser does not have any friends!");
				} else {
					t.update(otherUserRef, {
						friendsCount: currentOtherUserCount - 1,
					});
				}
				return res.status(200).json({
					message: `${user.id} is no longer friend with ${otherUser.id}`,
				});
			});
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// ==== FRIEND REQUESTS ====
// Get all friend's request of a user (by User's ID)
app.get("/friendrequests/users/:id", async (req, res) => {
	try {
		// Declare DB reference
		const db = admin.firestore();

		// Retrieve a user's reference
		const userID = req.params.id;
		const userRef = db.collection("users").doc(userID);

		// Query list of friend requests that were sent to the user
		const friendRequestQuery = await db
			.collection("friendRequests")
			.where("receiveUser", "==", userRef)
			.where("status", "==", "pending")
			.get();
		if (friendRequestQuery.empty) {
			return res.status(200).json([]);
		}

		let friendRequests = [];
		for await (let fr of friendRequestQuery.docs) {
			const sendUserRef = await fr.data().sendUser.get();
			friendRequests.push({
				id: fr.id,
				sendUser: sendUserRef.data(),
				status: fr.data().status,
			});
		}
		return res.status(200).json(friendRequests);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Get a friend request sent between two users
app.get("/friendrequests/get", async (req, res) => {
	try {
		// Declare DB Firebase with Admin rights
		const db = admin.firestore();
		// Get users' references
		const userRef = db.doc("users/" + req.query.userID);
		const otherUserRef = db.doc("users/" + req.query.otherUserID);

		// Query friendship request
		const frQuerySnapshot = await db
			.collection("friendRequests")
			.where("sendUser", "==", userRef)
			.where("receiveUser", "==", otherUserRef)
			.where("status", "==", "pending")
			.get();
		const frQuerySnapshot_2 = await db
			.collection("friendRequests")
			.where("sendUser", "==", otherUserRef)
			.where("receiveUser", "==", userRef)
			.where("status", "==", "pending")
			.get();

		// Merge results for OR operator of the query
		const or_array = frQuerySnapshot.docs.concat(frQuerySnapshot_2.docs);

		if (or_array.length == 0) {
			if (!or_array[0] && typeof or_array[0] === "undefined") {
				throw new Error("Invalid Friend Request reference");
			}
			return res.status(200).json({});
		}
		const fr = or_array[0];
		const sendUserSnapshot = await fr.data().sendUser.get();
		const receiveUserSnapshot = await fr.data().receiveUser.get();
		let frObj = {
			id: fr.id,
			createdAt: fr.data().createdAt,
			sendUser: {
				...sendUserSnapshot.data(),
			},
			receiveUser: {
				...receiveUserSnapshot.data(),
			},
			status: fr.data().status,
		};
		return res.status(200).json(frObj);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Send a Friend Request to a User
app.post("/friendrequests/send", async (req, res) => {
	try {
		// Declare DB Firebase by Admin rights
		const db = admin.firestore();
		const sendUserRef = db.doc("users/" + req.body.sendUserID);
		const receiveUserRef = db.doc("users/" + req.body.receiveUserID);

		// Check existence
		if (
			!sendUserRef &&
			typeof sendUserRef === "undefined" &&
			!receiveUserRef &&
			typeof receiveUserRef === "undefined"
		) {
			return res.status(200).json({
				message: "No user's reference found",
			});
		}

		// Check duplicated friend request
		const frQuery_1 = await db
			.collection("friendRequests")
			.where("sendUser", "==", sendUserRef)
			.where("receiveUser", "==", receiveUserRef)
			.where("status", "==", "pending")
			.get();
		const frQuery_2 = await db
			.collection("friendRequests")
			.where("sendUser", "==", receiveUserRef)
			.where("receiveUser", "==", sendUserRef)
			.where("status", "==", "pending")
			.get();

		const or_array = frQuery_1.docs.concat(frQuery_2.docs);
		if (or_array.length > 0) {
			return res.status(400).json({
				message: "ERROR 400 Duplicated Friend Request",
			});
		}

		// Create new friend's request schema
		const newFriendRequest = {
			sendUser: sendUserRef,
			receiveUser: receiveUserRef,
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
			status: "pending",
		};

		// Add new request to the collection
		const addedFriendRequest = await db.collection("friendRequests").add(newFriendRequest);

		return res.status(200).json({
			message: `friendRequest document ${addedFriendRequest.id} created successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

// Accept a Friend Request from a User
app.post("/friendrequests/accept", async (req, res) => {
	try {
		const { friendRequestID } = req.body;
		// Declare DB Firebase with Admin rights
		const db = admin.firestore();

		// Declare DB reference
		const frRef = db.collection("friendRequests").doc(friendRequestID);
		const frSnapshot = await frRef.get();
		// Check existence
		if (!frSnapshot.exists && typeof frSnapshot === "undefined") {
			return res.status(400).json({
				message: "No friendRequest's reference found",
			});
		}

		// Else if 'accept' the friend's request
		const sendUserRef = frSnapshot.data().sendUser;
		const receiveUserRef = frSnapshot.data().receiveUser;

		if (
			!sendUserRef &&
			typeof sendUserRef === "undefined" &&
			!receiveUserRef &&
			typeof receiveUserRef === "undefined"
		) {
			return res.status(400).json({
				message: "Invalid send user OR receive user",
			});
		}

		// Prepare schemas for added friendship document
		const newFriendShip = {
			user: sendUserRef,
			otherUser: receiveUserRef,
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
			friendRequest: frRef,
		};
		// Add operations
		await db
			.collection("friendships")
			.add(newFriendShip)
			.then((doc) => {
				console.log(`Friendship document ${doc.id} has been created successfully`);
			});

		// Transaction for multiple operations
		const dbTransaction = db
			.runTransaction(async (t) => {
				const docs = await t.getAll(frRef, sendUserRef, receiveUserRef);
				// Read Snapshots by references
				let fr = docs[0];
				let sendUser = docs[1];
				let receiveUser = docs[2];
				// Check existance
				if (!fr.exists && !sendUser.exists && !receiveUser.exists) {
					return res.status(400).json({
						message: "Invalid send user OR receive user OR friend request",
					});
				}
				// Update counter for both sender and receiver
				let sendUserCount = sendUser.data().friendsCount;
				let receiveUserCount = receiveUser.data().friendsCount;

				// Perform update operations for Friend Request entity
				t.update(frRef, { status: "accepted" });

				// Perform update operations for the count of sendUser's entity
				if (sendUserCount && typeof sendUserCount !== "undefined") {
					t.update(sendUserRef, { friendsCount: sendUserCount + 1 });
				} else {
					t.update(sendUserRef, { friendsCount: 1 });
				}

				// Perform update operations for the count of receiveUser's entity
				if (receiveUserCount && typeof receiveUserCount !== "undefined") {
					t.update(receiveUserRef, { friendsCount: receiveUserCount + 1 });
				} else {
					t.update(receiveUserRef, { friendsCount: 1 });
				}
			})
			.then(() => {
				return res.status(200).json({
					messasge: `SendUserID ${sendUserRef.id} has been friend with ReceiveUserID ${receiveUserRef.id}`,
				});
			})
			.catch((error) => {
				console.log("Transaction failed: ", error);
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Decline/Remove a friend request
app.delete("/friendrequests/:id/remove", async (req, res) => {
	try {
		// Declare DB Firebase with Admin rights
		const db = admin.firestore();

		// Declare DB reference
		const frRef = db.collection("friendRequests").doc(req.params.id);
		const frSnapshot = await frRef.get();
		// Check existence
		if (!frSnapshot.exists && typeof frSnapshot === "undefined") {
			return res.status(400).json({
				message: "No friendRequest's reference found",
			});
		}
		await frRef.delete();
		return res.status(200).json({
			message: `friendRequest document ${frSnapshot.id} has been deleted successfuly`,
		});
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

// ====== JOURNEY HISTORY ======
// Get all histories of all users
app.get("/users/histories", async (req, res) => {
	try {
		const db = admin.firestore();
		const historiesQuery = await db.collection("histories").get();

		let histories = [];

		for await (let history of historiesQuery.docs) {
			// Retrieve user's object from document's reference
			const userRef = await history.data().user.get();
			const user = userRef.data();
			// Retrieve attraction's from document's reference
			const attractionRef = await history.data().attraction.get();
			const attraction = attractionRef.data();
			// Check if the attraction and user are available or not
			if (attraction && user && typeof attraction !== "undefined" && typeof user !== "undefined") {
				console.log("Document User and Attraction exist!");
			} else {
				throw new Error("Not found error");
			}
			// Push well-structured (including detailed user, detailed attraction) History object to the list
			histories.push({
				id: history.id,
				createdAt: history.data().createdAt,
				user: {
					id: userRef.id,
					...user,
				},
				attraction: {
					id: attractionRef.id,
					...attraction,
				},
			});
		}
		return res.json(histories);
	} catch (error) {
		console.log(error);
	}
});

// Post a new history to Histories collection
app.post("/users/histories", async (req, res) => {
	try {
		// Declare firestore authentication
		const db = admin.firestore();

		// Declare reference values
		const userRef = db.doc("users/" + req.body.userID);
		const attractionRef = db.doc("attractions/" + req.body.attractionID);
		const attractionData = await attractionRef.get();
		// Get attraction's reward point on reference
		const attractionReward = attractionData.get("reward");
		// Check if the references of user and attraction are existing or NOT?
		if (
			!userRef &&
			!attractionRef &&
			typeof userRef === "undefined" &&
			typeof attractionRef === "undefined" &&
			!attractionReward &&
			typeof attractionReward === "undefined"
		) {
			return res.status(204).json({
				message: "No User or Attraction found",
			});
		}

		// Declare schema for post request object of History
		const newHistory = {
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
			user: userRef,
			attraction: attractionRef,
		};

		// Add new History object to Firestore (POST Method)
		db.collection("histories")
			.add(newHistory)
			.then((doc) => {
				userRef.update({
					journeyCount: admin.firestore.FieldValue.increment(1),
					totalReward: admin.firestore.FieldValue.increment(attractionReward),
				});
				res.json({
					message: `History ${doc.id} created successfully`,
				});
			});
		// Increase journey's count by 1
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Delete ALL Histories of a user
app.delete("/users/:id/histories", async (req, res) => {
	try {
		// Declare firestore authentication
		const db = admin.firestore();

		const userRef = db.collection("users").doc(req.params.id);

		const historiesQuery = await db.collection("histories").where("user", "==", userRef).get();
		if (historiesQuery.empty) {
			return res.status(204).json({
				message: "No histories found",
			});
		}

		let deleteCount = 0;

		for await (let history of historiesQuery.docs) {
			const historyRef = db.collection("histories").doc(history.id);
			historyRef.delete();
			deleteCount++;
		}
		return res.status(200).json({
			message: `Successfully deleted ${deleteCount} Histories documents`,
		});
		// Declare schema
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Delete ONE history
app.delete("/users/histories/:id", async (req, res) => {
	try {
		const db = admin.firestore();

		const historyRef = db.collection("histories").doc(req.params.id);

		if (typeof historyRef == "undefined") {
			return res.status(204).json({
				message: `No History found`,
			});
		}
		// Delete history by reference
		historyRef.delete();
		res.json({
			message: `History document ${historyRef.id} deleted successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Get user's histories by user's ID
app.get("/users/:id/histories", async (req, res) => {
	try {
		// Declare firestore authentication
		const db = admin.firestore();
		// Queries to collections
		const userQuery = db.collection("users").doc(req.params.id);
		// Compare the the reference between the stored value in 'history' collection and the 'user' collection
		const historyQuery = await db
			.collection("histories")
			.where("user", "==", userQuery)
			.get()
			.then();
		// Check if the query matches any document
		if (historyQuery.empty) {
			return res.status(204).json({ message: "user's histories not found" });
		}
		// read the reference from user's query
		const userRef = await userQuery.get();
		// declare reference to detailed object
		let user = {
			id: userRef.id,
			...userRef.data(),
		};
		let histories = [];
		for await (let history of historyQuery.docs) {
			// Retrieve attraction's object from document reference
			const attractionRef = await history.data().attraction.get();
			const attraction = attractionRef.data();
			// Check if there's any empty query
			if (attraction || typeof attraction !== "undefined") {
				console.log("Attraction exist");
			} else {
				console.log(`Attraction not exist`);
				throw new Error("Not found error");
			}
			histories.push({
				id: history.id,
				createdAt: history.data().createdAt,
				user: {
					...user,
				},
				attraction: {
					id: attractionRef.id,
					...attraction,
				},
			});
		}
		return res.json(histories);
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Create a new user
app.post("/users", (req, res) => {
	const newUser = {
		phoneNumber: req.body.phoneNumber,
		name: req.body.name,
		gender: req.body.gender,
		urlAvatar: req.body.urlAvatar,
	};

	admin
		.firestore()
		.collection("users")
		.add(newUser)
		.then((doc) => {
			res.json({
				message: `document ${doc.id} created successfully.`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

// reviews API
// tested
app.post("/reviews", (req, res) => {

    let newReview = {
        content: req.body.content,
        rating: req.body.rating,
        uid: admin.firestore().doc(`users/${req.body.uid}`),
        timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
        aid:req.body.aid,
        likeCount: 0,
		images: []
    }

    admin.firestore()
        .collection("reviews")
        .add(newReview)
        .then((doc) => {
            res.json({
                message: `document ${doc.id} created successfully`
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
            console.error(err)
        })
})

// tested
app.get("/reviews/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("reviews")
			.where("__name__", "==", `${req.params.id}`)
			.get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction[0]);
		}
		return res.json({ error: "dumaduy" });
	} catch (err) {
		console.log(err);
	}
});

// tested

app.get("/reviews/attractions/:id", async (req,res) => {
    try {
        let db = admin.firestore();
        let attractionRef = await db.collection('reviews').where('aid', '==', `${req.params.id}`).get();

        if (!attractionRef.empty) {
            let attraction = []

			for await (let a of attractionRef.docs){
				const userRef = await a.data().uid.get();
				const useInfo = await userRef.data();
				if (useInfo && typeof useInfo != "undefined" && typeof a != "undefined" && a ){
					console.log("it wworked bae uhh")
				}
				else {
					throw new Error("one of the data is not found")
				}
				attraction.push({
					id:a.id,
					comment : {
						id: a.id,
						...a.data()
					},
					userInfo : {
						id : userRef.id, 
						...useInfo
					}
				})
			}
            // attractionRef.forEach(a => {
            //     attraction.push({
            //         id: a.id,
            //         ...a.data()
            //     })
            // })
            return res.json(attraction);
        }
        return res.json({ "error": "dumaduy" })
    } catch (err) {
        console.log(err)
    }
})



// app.get("/reviews/attractions/:id", async (req,res) => {
//     try {
//         let db = admin.firestore();

//         let attractionRef = await db.collection('reviews').where('aid', '==', `${req.params.id}`).get();
//         if (!attractionRef.empty) {
//             let attraction = []

// 			for await (let a of attractionRef){
// 				// const useRef = a.data().uid.get();
// 				// const user = useRef.data();
// 				// if (user &&  typeof user != "undefined"){
// 				// 	console.log("user exist bruh")
// 				// 	attraction.push({
// 				// 		id : a.id,
// 				// 		user: {
// 				// 			id : user.id,
// 				// 			...user
// 				// 		},
// 				// 		review : {
// 				// 			id:a.id,
// 				// 			...a
// 				// 		}
// 				// 	})
// 				// }
// 				// else {
// 				// 	throw new Error("Not found user");
// 				// }

// 				attraction.push({
// 					id : a.id,
// 					...a
// 				})
// 			}
			
            
//             return res.json(attraction);
//         }
//         return res.json({ "error": "dumaduy" })
//     } catch (err) {
//         console.log(err)
//     }
// })


// tested
app.put("/reviews/:id", (req, res) => {
	admin
		.firestore()
		.collection("reviews")
		.doc(req.params.id)
		.update({
			content: req.body.content,
			rating: req.body.rating,
		})
		.then((doc) => {
			res.json({
				message: `document ${doc.id} updated successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

// like api

// tested
app.post("/like", (req, res) => {
	const newLike = {
		uid: admin.firestore().doc(`users/${req.body.uid}`),
		rid: admin.firestore().doc(`reviews/${req.body.rid}`),
	};

	admin
		.firestore()
		.collection("like")
		.add(newLike)
		.then((doc) => {
			res.json({
				message: `document ${doc.id} created successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

// tested
app.get("/like/reviews/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db.collection("like").where("rid", "==", `${req.params.id}`).get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
app.get("/like/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("like")
			.where("__name__", "==", `${req.params.id}`)
			.get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction[0]);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
app.delete("/like/:id", async (req, res) => {
	try {
		const LikeRef = admin.firestore().collection("like").doc(req.params.id);
		LikeRef.get().then((snap) => {
			if (snap.exists) {
				LikeRef.delete().then(() => {
					res.json({
						message: `document ${req.params.id} deleted`,
					});
				});
			} else {
				res.json({
					message: "document not exist",
				});
			}
		});
	} catch (err) {
		res.status(400).json({
			error: err,
		});
		console.error(err);
	}
});

// reply api

// tested
app.post("/reply", (req, res) => {
	const newReply = {
		rid: admin.firestore().doc(`reviews/${req.body.rid}`),
		content: req.body.content,
		timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
		uid: admin.firestore().doc(`users/${req.body.uid}`),
	};
	admin
		.firestore()
		.collection("reply")
		.add(newReply)
		.then((doc) => {
			res.json({
				message: `document ${doc.id} created successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

//
app.get("/reply/reviews/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db.collection("reply").where("rid", "==", `${req.params.id}`).get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
app.get("/reply/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("reply")
			.where("__name__", "==", `${req.params.id}`)
			.get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction[0]);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
app.put("/reply/:id", (req, res) => {
	try {
		let db = admin.firestore();

		db.collection("reply")
			.doc(`${req.params.id}`)
			.update({
				content: req.body.content,
			})
			.then(() => {
				res.json({
					message: `document ${req.params.id} updated successfully `,
				});
			});
	} catch (err) {
		console.log(err);
	}
});

// tested
app.delete("/reply/:id", (req, res) => {
	try {
		const LikeRef = admin.firestore().collection("reply").doc(req.params.id);
		LikeRef.get().then((snap) => {
			if (snap.exists) {
				LikeRef.delete().then(() => {
					res.json({
						message: `document ${req.params.id} deleted`,
					});
				});
			} else {
				res.json({
					message: "document not exist",
				});
			}
		});
	} catch (err) {
		res.status(400).json({
			error: err,
		});
		console.error(err);
	}
});

// Exports API
exports.api = functions.region("asia-east2").https.onRequest(app);
