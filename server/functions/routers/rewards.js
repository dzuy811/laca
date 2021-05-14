const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for system_rewards Collection (/api/rewards/system) ----- //
router.get("/system", async (req, res) => {
	try {
		// Declare DB reference
		const db = admin.firestore();

		// Declare reference to Rewards collection
		const rewardsRef = await db.collection("system_rewards").get();

		// Retrieve all rewards from system
		let systemRewards = [];
		for await (let reward of rewardsRef.docs) {
			systemRewards.push({
				id: reward.id,
				...reward.data(),
			});
		}
		return res.status(200).json(systemRewards);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

router.post("/system", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare body params
		const { description, rewardPrice, expiryDatetime } = req.body;

		// Pre-process json string to Date on structured format
		const formatDatetime = dayjs(expiryDatetime, "HH:mm:ss DD-MM-YYYY").toDate();
		// Declare POST Schema
		const newSystemReward = {
			description: description,
			rewardPrice: rewardPrice,
			expiryDate: admin.firestore.Timestamp.fromDate(formatDatetime),
		};

		// Declare reference to System rewards
		const rewardsRef = db.collection("system_rewards");
		const addedDoc = await rewardsRef.add(newSystemReward);
		return res.status(201).json({
			id: addedDoc.id,
			path: `system_rewards/${addedDoc.id}`,
			message: `System reward document ${addedDoc.id} created successfully!`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Buy a System Reward Copy
router.post("/system/users/buy", async (req, res) => {
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
		const dbTransaction = db.runTransaction(async (t) => {
			let docs = await t.getAll(userRef, systemRewardRef);
			let user = docs[0];
			let systemReward = docs[1];
			// Read current values
			let totalReward = user.data().totalReward;
			let redeemedCount = systemReward.data().redeemed;
			let rewardPrice = systemReward.data().rewardPrice;
			// Check if the reward has been out of stock or not
			if (redeemedCount == systemReward.data().totalQuantity) {
				return res.status(404).json({
					message: "System Reward is unavailable.",
				});
			}
			// Check if user has enough reward points for the transaction
			if (rewardPrice > totalReward) {
				return res.status(400).json({
					message: "ERROR! User does not have enough reward points.",
				});
			}
			// Update values
			t.update(userRef, {
				totalReward: totalReward - rewardPrice,
			});
			t.update(systemRewardRef, {
				redeemed: redeemedCount + 1,
			});
		});

		// Initialize a copy of System Reward for user
		await db
			.collection("system_reward_copies")
			.add(newSystemReward)
			.then((doc) => {
				return res.status(201).json({
					id: doc.id,
					path: `system_reward_copies/${doc.id}`,
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

// Update essential information for System Rewards
router.put("/system/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Update body for Reward System
		const { description, rewardPrice, expiryDatetime } = req.body;

		// Declare reference to reward system
		const rewardSystemRef = db.collection("system_rewards").doc(req.params.id);

		// Pre-process json string to Date on structured format
		const formatDatetime = dayjs(expiryDatetime, "HH:mm:ss DD-MM-YYYY").toDate();

		// Declare POST Schema
		const newSystemReward = {
			description: description,
			rewardPrice: rewardPrice,
			expiryDatetime: admin.firestore.Timestamp.fromDate(formatDatetime),
		};

		await rewardSystemRef.update(newSystemReward);
		return res.status(200).json({
			id: rewardSystemRef.id,
			path: `system_rewards/${rewardSystemRef.id}`,
			message: `System Reward document ${rewardSystemRef.id} updated successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

router.delete("/system/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare System Rewards reference
		const systemRewardRef = db.collection("system_rewards").doc(req.params.id);
		const systemRewardSs = await systemRewardRef.get();

		// Double check existance error
		if (!systemRewardSs.exists) {
			throw new Error("System reward reference not found.");
		}

		await systemRewardRef.delete();
		return res.status(200).json({
			id: systemRewardRef.id,
			path: `system_rewards/${systemRewardRef.id}`,
			message: `System Reward document ${systemRewardRef.id} deleted successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// ---- API for PartnerReward Collection (/api/rewards/partner) ----- //
// READ All Partner Rewards available in the System
router.get("/partner", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to collection
		const partnerRewardsRef = db.collection("partner_rewards");
		const partnersRewardSnapshot = await partnerRewardsRef.get();

		// Response all rewards retrieved
		let partnerRewards = [];
		let partnerRewardCount = 0;
		for await (let pReward of partnersRewardSnapshot.docs) {
			// Reference to partner data
			let partnerData = pReward.data();
			// Retrieve snapshot of referenced partner
			let partnerSs = await pReward.data().partner.get();

			partnerData.partner = {
				id: partnerSs.id,
				...partnerSs.data(),
			};
			// Push to the response body
			partnerRewards.push({
				id: pReward.id,
				...partnerData,
			});
			partnerRewardCount++;
		}
		return res.status(200).json({
			partnerRewardCount,
			partnerRewards: partnerRewards,
		});
	} catch (error) {
		console.log(error);
	}
});

// CREATE a Partner Reward
router.post("/partner", async (req, res) => {});

module.exports = router;
