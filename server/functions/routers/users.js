const functions = require("firebase-functions");
const express = require("express");
const Cors = require("cors");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
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

// Friendship of a user
router.get("/:id/friendships", async (req, res) => {
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
