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

// READ One Partner by id
router.get("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Reference to Partner Collection by ID
		const partnerRef = db.collection("partners").doc(req.params.id);
		const partnerSnapshot = await partnerRef.get();

		if (!partnerSnapshot.exists) {
			return res.status(200).json({});
		}
		let partner = {
			id: partnerSnapshot.id,
			...partnerSnapshot.data(),
		};

		return res.status(200).json(partner);
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// CREATE a Partner
router.post("/", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to Partners collection
		const partnersRef = db.collection("partners");

		// Declare schema for new partner
		const newPartner = {
			name: req.body.name,
			phone: req.body.phone,
			address: [req.body.address_line_1, req.body.address_line_2],
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
		};

		// Add partner to firestore's collection
		partnersRef.add(newPartner).then((doc) => {
			return res.status(201).json({
				id: doc.id,
				path: `partners/${doc.id}`,
				message: `Partner document ${doc.id} created successfully.`,
			});
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// UPDATE a Partner on basic information
router.put("/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare Reference to the Partner document
		const partnerRef = db.doc("partners/" + req.params.id);

		// declare Update body
		const updatedPartner = {
			name: req.body.name,
			phone: req.body.phone,
			address: [req.body.address_line_1, req.body.address_line_2],
		};

		// Update operation for Partner
		await partnerRef.update(updatedPartner).then(() => {
			return res.status(200).json({
				id: partnerRef.id,
				path: `partners/${partnerRef.id}`,
				message: `Partner document ${partnerRef.id} updated successfully.`,
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
