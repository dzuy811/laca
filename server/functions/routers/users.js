const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for USERS Collection (/api/users/) ----- //
// Get ALL Users
router.get("/", (req, res) => {
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

// Create a new user
router.post("/", (req, res) => {
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
				id: doc.id,
				path: `users/${doc.id}`,
				message: `User document ${doc.id} created successfully.`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

// Get ONE User
router.get("/:id", async (req, res) => {
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
router.get("/search/details", async (req, res) => {
	try {
		// Declare DB schema
		const db = admin.firestore();
		// create reference for User collection on Firestore
		const usersRef = db.collection("users");
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
/// ----- FRIENDSHIPs of a user ----- ///
// Friendship of a user
router.get("/:id/friendships", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();
		const userID = req.params.id;

		// Reference to the user by params id
		const userRef = db.doc("users/" + userID);
		const userSnapshot = await userRef.get();

		// Query list of friends of that particular user
		const friendshipQuery_user = await db
			.collection("friendships")
			.where("user", "==", userRef)
			.get();
		const friendshipQuery_otherUser = await db
			.collection("friendships")
			.where("otherUser", "==", userRef)
			.get();

		const queryArray_user = friendshipQuery_user.docs;
		const queryArray_otherUser = friendshipQuery_otherUser.docs;

		if (queryArray_user.length == 0 && queryArray_otherUser.length == 0) {
			return res.status(200).json([]);
		}

		// Union of two sets to remove duplicate on prop "id"
		const queryArray = helper.unionOnProp(queryArray_user, queryArray_otherUser, "id");

		// Retrieve friend's ID from friendship entity
		let responses = [];
		for await (let friendship of queryArray) {
			let currentFriendUserSnapshot;
			const userData = friendship.data().user;
			const otherUserData = friendship.data().otherUser;
			// Assign IDs to the friend reference
			if (userData.id == userRef.id) {
				currentFriendUserSnapshot = await otherUserData.get();
			} else {
				currentFriendUserSnapshot = await userData.get();
			}
			responses.push({
				id: friendship.id,
				createdAt: friendship.data().createdAt,
				otherUser: {
					...currentFriendUserSnapshot.data(),
				},
			});
		}
		return res.status(200).json({
			friendsCount: userSnapshot.data().friendsCount,
			friendships: responses,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

/// ----- LEADERBOARD of All Users ----- ///
router.get("/details/leaderboard", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();
		// Define query params
		const { size } = req.query;
		// Get snapshot of the Users collection
		var userCollectionQuery;
		if (size) {
			userCollectionQuery = db
				.collection("users")
				.orderBy("journeyCount", "desc")
				.limit(parseInt(size));
		} else {
			userCollectionQuery = db.collection("users").orderBy("journeyCount", "desc");
		}

		const usersSnapshot = await userCollectionQuery.get();
		const snapshotLength = usersSnapshot.docs.length;

		users = [];
		for await (let user of usersSnapshot.docs) {
			users.push({
				id: user.id,
				...user.data(),
			});
		}

		return res.status(200).json({
			totalUsers: snapshotLength,
			leaderboard: users,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

/// ----- LEADERBOARD Between Friends (friendships) of a user ----- ///
router.get("/:id/friendships/leaderboard", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();
		const userID = req.params.id;

		// Reference to the user by params id
		const userRef = db.doc("users/" + userID);
		const userSnapshot = await userRef.get();

		// Query list of friends of that particular user
		const friendshipQuery_user = await db
			.collection("friendships")
			.where("user", "==", userRef)
			.get();
		const friendshipQuery_otherUser = await db
			.collection("friendships")
			.where("otherUser", "==", userRef)
			.get();

		const queryArray_user = friendshipQuery_user.docs;
		const queryArray_otherUser = friendshipQuery_otherUser.docs;

		if (queryArray_user.length == 0 && queryArray_otherUser.length == 0) {
			return res.status(200).json([]);
		}

		// Union of two sets to remove duplicate on prop "id"
		const queryArray = helper.unionOnProp(queryArray_user, queryArray_otherUser, "id");
		queryArray.sort(helper.sortBy());

		// Retrieve friend's ID from friendship entity
		let responses = [];
		for await (let friendship of queryArray) {
			let currentFriendUserSnapshot;
			const userData = friendship.data().user;
			const otherUserData = friendship.data().otherUser;
			// Assign IDs to the friend reference
			if (userData.id == userID) {
				currentFriendUserSnapshot = await otherUserData.get();
			} else {
				currentFriendUserSnapshot = await userData.get();
			}
			responses.push({
				// id: friendship.id,
				// createdAt: friendship.data().createdAt,

				...currentFriendUserSnapshot.data(),
			});
		}
		// Append current user to the list for ranking purpose
		responses.push({
			id: userSnapshot.id,
			...userSnapshot.data(),
		});

		// Sort by journey count value in DESCending order
		responses.sort(helper.sortBy("journeyCount", true, null));

		// Add Ranking property for each user in the friendlist including the current user
		let rank = 1;
		let currentUserRank;
		for (var i = 0; i < responses.length; i++) {
			// increase rank only if current score less than previous
			if (i > 0 && responses[i].journeyCount < responses[i - 1].journeyCount) {
				rank++;
			}
			responses[i].rank = rank;
			// Define current user's rank
			if (responses[i].id == userID) {
				currentUserRank = rank;
			}
		}

		return res.status(200).json({
			currentUserRank,
			leaderboard: responses,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// ====== JOURNEY HISTORY ======
// Get all histories of all users
router.get("/histories", async (req, res) => {
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
router.post("/histories", async (req, res) => {
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
			status: req.body.status,
		};

		// Add new History object to Firestore (POST Method)
		db.collection("histories")
			.add(newHistory)
			.then((doc) => {
				// userRef.update({
				// 	journeyCount: admin.firestore.FieldValue.increment(1),
				// 	totalReward: admin.firestore.FieldValue.increment(attractionReward),
				// });
				res.status(201).json({
					id: doc.id,
					path: `/histories/${doc.id}`,
					message: `History document ${doc.id} created successfully.`,
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

// Journey History completition mark
router.put("/histories/:id/finish", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();

		// Params declaration
		let { historyID } = req.params.id;

		// Document History reference
		const historyRef = db.collection("histories").doc(historyID);
		const historySnapshot = await historyRef.get();
		const historyUserRef = historySnapshot.data().user;
		const historyAttractionRef = historySnapshot.data().attraction;

		if (!historySnapshot.exists) {
			throw new Error("History reference not found.");
		}

		// Mark the journey of the user as finished
		await historyRef.update({
			finishedAt: admin.firestore.Timestamp.fromDate(new Date()),
			status: "finished",
		});

		// Transaction to to update current values for visitCount, journeyCount
		const dbTransaction = db.runTransaction(async (t) => {
			const docs = await t.getAll(historyUserRef, historyAttractionRef);
			// Read snapshots via ref(s)
			let user = docs[0];
			let attraction = docs[1];
			if (!user.exists) {
				throw new Error("User reference not found.");
			} else if (!attraction.exists) {
				throw new Error("Attraction reference not found.");
			}
			// Read current values of all docs
			let currentUserJourneyCount = user.data().journeyCount;
			let currentUserReward = user.data().totalReward;
			let currentAttractionVisitCount = attraction.data().visitCount;
			// Update jounrey count prop for user
			t.update(historyUserRef, {
				journeyCount: currentUserJourneyCount + 1,
				totalReward: currentUserReward + attraction.data().reward,
			});
			// Update visit count prop for attraction
			t.update(historyAttractionRef, {
				visitCount: currentAttractionVisitCount + 1,
			});
		});
		return res.status(200);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Journey History cancellation mark
router.put("/histories/:id/cancel", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();

		// Params declaration
		let { historyID } = req.params.id;

		// Document History reference
		const historyRef = db.collection("histories").doc(historyID);
		const historySnapshot = await historyRef.get();

		// Check existance of history reference
		if (!historySnapshot.exists) {
			throw new Error("History reference does not exist.");
		}

		// Check invalid history status to stop the function
		if (historySnapshot.data().status == "finished") {
			throw new Error("Journey has been completed and cannot be canceled.");
		} else if (historySnapshot.data().status == "canceled") {
			throw new Error("Journey has been canceled.");
		}

		await historyRef.update({
			status: "canceled",
		});
		return res.status(200).json({
			message: `History document ${historyRef} has been canceled successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Delete ALL Histories of a user
router.delete("/:id/histories", async (req, res) => {
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
router.delete("/histories/:id", async (req, res) => {
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
router.get("/:id/histories", async (req, res) => {
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

module.exports = router;
