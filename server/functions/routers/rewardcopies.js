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
router.get("/system", async (req, res) => {
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

// Post a new reward copy systems
router.post("/system", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare request body
		const { userID, systemRewardID } = req.body;

		// Declare new system reward copy
		const newCopy = {
			user: db.doc("users/" + userID),
			systemReward: db.doc("system_rewards/" + systemRewardID),
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
		};

		// Assign new copy to user
		const addedDoc = await db.collection("system_rewards_copies").add(newCopy);
		return res.status(200).json({
			id: addedDoc.id,
			path: `system_reward_copies/${addedDoc.id}`,
			message: `System Reward Copy document ${addedDoc.id} created successfully!`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR ${error}`,
		});
	}
});

// Get all system reward copie of a user by ID
router.get("/system/users/:id", async (req, res) => {
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
router.put("/system/redeem/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to System Reward Copy
		const systemCopyRef = db.collection("system_reward_copies").doc(req.params.id);

		await systemCopyRef.update({
			status: "used",
		});

		return res.status(200).json({
			id: systemCopyRef.id,
			path: `system_reward_copies/${systemCopyRef.id}`,
			message: `System Reward Copy document ${systemCopyRef.id} updated successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
	}
});

// Delete a system reward copy by its ID
router.delete("/systems/:id", async (req, res) => {
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
			path: `system_reward_copies/${systemCopyRef.id}`,
			message: `System Reward Copy document ${systemCopyRef.id} deleted successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

module.exports = router;
