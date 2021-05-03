const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
// ---- API For FRIENDREQUESTS Collection (/api/friendrequests/) ---- //
// ==== FRIEND REQUESTS ====
// Get all friend's request of a user (by User's ID)
router.get("/users/:id", async (req, res) => {
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
router.get("/get", async (req, res) => {
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
router.post("/send", async (req, res) => {
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
router.post("/accept", async (req, res) => {
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
router.delete("/:id/remove", async (req, res) => {
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

module.exports = router;
