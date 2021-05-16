const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");

// ---- API for PartnerReward Collection (/api/rewards/partner-rewards) ----- //
// READ All Partner Rewards available in the System
router.get("/", async (req, res) => {
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

// READ One Partner Reward by ID
router.get("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Retrieve document by ID
		db.doc(`partner_rewards/${req.params.id}`)
			.get()
			.then(async (doc) => {
				// Reference to partner data
				let partnerData = doc.data();
				// Retrieve snapshot of referenced partner
				let partnerSs = await doc.data().partner.get();

				partnerData.partner = {
					id: partnerSs.id,
					...partnerSs.data(),
				};
				return res.status(200).json({
					id: doc.id,
					...partnerData,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
	}
});

// CREATE a Partner Reward
router.post("/", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare Partner Reward schema
		const newPartnerReward = {
			content: req.body.content,
			rewardPrice: req.body.rewardPrice,
			partner: db.doc("partners/" + req.body.partnerID),
			expiryDatetime: admin.firestore.Timestamp.fromDate(
				helper.stringToDatetime(req.body.expiryDatetime, "HH:mm:ss DD-MM-YYYY")
			),
		};

		// Add operations for Partner Reward
		db.collection("partner_rewards")
			.add(newPartnerReward)
			.then((doc) => {
				return res.status(200).json({
					id: doc.id,
					path: `partner_rewards/${doc.id}`,
					message: `Partner Reward document ${doc.id} has been created successfully.`,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// UPDATE a Partner Reward
router.put("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare Update bodies for Partner Reward
		const updatedPartnerReward = {
			content: req.body.content,
			rewardPrice: req.body.rewardPrice,
			partner: db.doc("partners/" + req.body.partnerID),
			expiryDatetime: admin.firestore.Timestamp.fromDate(
				helper.stringToDatetime(req.body.expiryDatetime, "HH:mm:ss DD-MM-YYYY")
			),
		};

		// Update operations for Partner Reward
		db.collection("partner_rewards")
			.doc(req.params.id)
			.update(updatedPartnerReward)
			.then(() => {
				return res.status(200).json({
					id: req.params.id,
					path: `partner_rewards/${req.params.id}`,
					message: `Partner Reward document ${req.params.id} updated successfully.`,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Delete a Partner Reward
router.delete("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Delete Operation for Partner Reward
		await db
			.doc("partner_rewards/" + req.params.id)
			.delete()
			.then(() => {
				return res.status(200).json({
					id: req.params.id,
					path: `partner_rewards/${req.params.id}`,
					message: `Partner Reward document ${req.params.id} updated successfully.`,
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
