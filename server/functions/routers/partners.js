const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for system_rewards Collection (/api/partners) ----- //
// Get list of all partners
router.get("/", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to partners collection
		const partnersRef = db.collection("partners");
		const partnersSnapshot = await partnersRef.get();

		// Retrieve list of all partners
		let partners = [];
		let partnerCount = 0;
		for await (let partner of partnersSnapshot.docs) {
			partners.push({
				id: partner.id,
				...partner.data(),
			});
			partnerCount++;
		}
		return res.status(200).json({
			partnerCount,
			partners: partners,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

router.post("/", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to Partners collection
		const partnersRef = db.collection("partners");

		// Declare schema for new partner
		const newPartner = {};
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

module.exports = router;
