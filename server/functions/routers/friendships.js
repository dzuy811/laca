const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
// ---- API For FRIENDSHIPS Collection (/api/friendships/) ---- //
// Get Friendship betweeen two users
router.get("/get", async (req, res) => {
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
			user: {
				id: friendshipDocUser.id,
				...friendshipDocUser.data(),
			},
			otherUser: {
				id: friendshipDocOtherUser.id,
				...friendshipDocOtherUser.data(),
			},
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Unfriend method
router.delete("/:id/remove", async (req, res) => {
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

module.exports = router;
