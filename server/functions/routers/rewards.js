const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for RewardSystem Collection (/api/users/) ----- //
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
			expiryDate: admin.firestore.Timestamp.fromDate(formatDatetime),
		};

		await rewardSystemRef.update(newSystemReward);
		return res.status(200).json({
			id: rewardSystemRef.id,
			path: `system_rewards/${rewardSystemRef.id}`,
			message: `System Reward document ${rewardSystemRef.id} updated successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

module.exports = router;
