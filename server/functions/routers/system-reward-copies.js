const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for system_reward_copies Collection (/api/rewardcopies/system) ----- //
// Get all system reward copies
router.get("/", async (req, res) => {
	try {
		// Declare DB Reference
		const db = admin.firestore();

		// Declare reference to all system_reward_copies
		const systemRewardCopiesRef = db.collection("system_reward_copies");
		const systemRewardCopiesSs = await systemRewardCopiesRef.get();

		// Iterate and retrieve list of all system_reward_copies available
		let listOfSRC = [];
		for await (let systemRewardCopy of systemRewardCopiesSs.docs) {
			const systemRewardCopyUser = systemRewardCopy.data().user;
			const userSs = await systemRewardCopyUser.get();
			const systemRewardCopyReward = await systemRewardCopy.data().systemReward;
			const systemRewardSs = await systemRewardCopyReward.get();

			listOfSRC.push({
				id: systemRewardCopy.id,
				user: {
					id: userSs.id,
					...userSs.data(),
				},
				systemRewards: {
					id: systemRewardSs.id,
					...systemRewardSs.data(),
				},
			});
		}
		return res.status(200).json(listOfSRC);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// UPDATE a new reward copy systems
router.put("/:copyID", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare request body
		const { userID, systemRewardID } = req.body;

		// Declare new system reward copy
		const newCopy = {
			user: db.doc("users/" + userID),
			status: req.body.status,
			systemReward: db.doc("system_rewards/" + systemRewardID),
			createdAt: helper.stringToDatetime(req.body.codeExpiryDatetime, "HH:mm:ss DD-MM-YYYY"),
		};

		// Assign new copy to user
		const addedDoc = await db.collection("system_rewards_copies").add(newCopy);
		return res.status(200).json({
			id: addedDoc.id,
			path: `/system_reward_copies/${addedDoc.id}`,
			message: `System Reward Copy document ${addedDoc.id} created successfully!`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR ${error}`,
		});
	}
});

// Buy a System Reward Copy
router.post("/buy", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare route params
		const { userID, systemRewardID } = req.body;

		// Declare references
		const userRef = db.doc("users/" + userID);
		const systemRewardRef = db.doc("system_rewards/" + systemRewardID);

		// Declare new copy of system reward
		const newSystemReward = {
			user: userRef,
			systemReward: systemRewardRef,
			status: "unused",
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
		};

		// Update batch in a transaction
		const dbTransaction = db
			.runTransaction(async (t) => {
				let docs = await t.getAll(userRef, systemRewardRef);
				let user = docs[0];
				let systemReward = docs[1];
				// Read current values
				let totalReward = user.data().totalReward;
				let redeemedCount = systemReward.data().redeemed;
				let rewardPrice = systemReward.data().rewardPrice;
				// Check if the reward has been out of stock or not
				if (redeemedCount == systemReward.data().totalQuantity) {
					throw new Error("System Reward is unavailable.");
				}
				// Check if user has enough reward points for the transaction
				if (rewardPrice > totalReward) {
					throw new Error("User does not have enough reward points.");
				}
				// Update values
				t.update(userRef, {
					totalReward: totalReward - rewardPrice,
				});
				t.update(systemRewardRef, {
					redeemed: redeemedCount + 1,
				});
			})
			.catch((error) => {
				console.log(error);
				throw error;
			});

		// Initialize a copy of System Reward for user
		await db
			.collection("system_reward_copies")
			.add(newSystemReward)
			.then((doc) => {
				return res.status(201).json({
					id: doc.id,
					path: `/system_reward_copies/${doc.id}`,
					message: `System Reward Copy document has been created successfully.`,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Get all system reward copie of a user by ID
router.get("/users/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare user reference
		const userRef = db.collection("users").doc(req.params.id);
		const userSs = await userRef.get();

		// Query all system reward copies of a user
		const systemRewardCopies = db.collection("system_reward_copies").where("user", "==", userRef);
		const querySnapshot = await systemRewardCopies.get();

		if (querySnapshot.empty) {
			return res.status(200).json([]);
		}

		// Retrieve list of all copies as a response
		let copies = [];
		let copyCount = 0;
		for await (let systemRewardCopy of querySnapshot.docs) {
			const systemRewardCopyReward = systemRewardCopy.data().systemReward;
			const systemRewardSs = await systemRewardCopyReward.get();
			copies.push({
				id: systemRewardCopy.id,
				user: {
					id: userSs.id,
					...userSs.data(),
				},
				systemRewards: {
					id: systemRewardSs.id,
					...systemRewardSs.data(),
				},
			});
			copyCount += 1;
			console.log(copyCount);
		}
		return res.status(200).json({
			systemRewardCount: copyCount,
			systemRewards: copies,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR ${error}`,
		});
	}
});

// Use the voucher (Cares later for SIDE EFFECTS);
router.put("/:copyID/users/:userID/redeem", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to System Reward Copy
		const systemCopyRef = db.collection("system_reward_copies").doc(req.params.copyID);
		const userRef = db.collection("users").doc(req.params.userID);
		const systemCopySnapshot = await systemCopyRef.get();

		// Check if user is authorized for redeeming this system reward
		if (systemCopySnapshot.data().user.id != userRef.id) {
			throw new Error("User does not have permission to redeem this System Reward.");
		}

		await systemCopyRef.update({
			status: "used",
		});

		return res.status(200).json({
			id: systemCopyRef.id,
			path: `/system_reward_copies/${systemCopyRef.id}`,
			message: `System Reward Copy document ${systemCopyRef.id} redeemed successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
	}
});

// DELETE a system reward copy by its ID
router.delete("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to the copy of system reward
		const systemCopyRef = db.collection("system_reward_copies").doc(req.params.id);

		if (!systemCopyRef & (typeof systemCopyRef === "undefined")) {
			throw new Error("System Reward Copy reference not found.");
		}

		await systemCopyRef.delete();
		return res.status(200).json({
			id: systemCopyRef.id,
			path: `/system_reward_copies/${systemCopyRef.id}`,
			message: `System Reward Copy document ${systemCopyRef.id} deleted successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// -------- API For PartnerRewardCopy (/api/rewardcopies/partner-rewards/) --------- //

module.exports = router;
