const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");
// ---- API for USERS Collection (/api/users/) ----- //
router.get("/", async (req, res) => {
	try {
		// Declare DB reference
		const db = admin.firestore();

		// Declare
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

module.exports = router;
