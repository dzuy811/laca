const express = require("express");
const router = express.Router();
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// Import Admin SDK
const admin = require("../constants/firebase");
const helper = require("../utilities/helper");

// ---- API for PartnerRewardCode Collection (/api/rewards/partners/:id/codes) ----- //
// READ ALL Codes of a PartnerReward document's ID
router.get("/partner-rewards/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to PartnerReward
		const partnerRewardRef = db.collection("partner_rewards").doc(req.params.id);

		// Retrieve all codes of a PartnerReward
		const querySnapshots = await db
			.collection("partner_reward_codes")
			.where("partnerReward", "==", partnerRewardRef)
			.get();

		// Check if query return empty results
		if (querySnapshots.empty) {
			return res.status(200).json([]);
		}

		// Retreive each snapshot from the query
		let codes = [];
		let codeCount = 0;
		for await (let code of querySnapshots.docs) {
			// Prepare data schema for PartnerReward
			let partnerRewardSnapshot = await code.data().partnerReward.get();
			let partnerSnapshot = await partnerRewardSnapshot.data().partner.get();
			// Get metadata and populate reference for Partner Reward Snapshot
			let partnerRewardMetaData = partnerRewardSnapshot.data();
			partnerRewardMetaData.partner = partnerSnapshot.data();
			// Get Data for code with user acquired
			let user = code.data().user;
			let userSnapshot;
			if (user & (typeof user !== "undefined")) {
				userSnapshot = await user.get();
			}
			// Aggregate into object
			let partnerRewardData;
			partnerRewardData = Object.assign({ id: partnerRewardSnapshot.id }, partnerRewardMetaData);
			// Delete FK Partner of PartnerReward
			// Assign detailed snapshot to code's data
			let codeData = code.data();
			delete codeData.partner;
			delete codeData.partnerReward;

			// Response with/without user
			if (!userSnapshot) {
				codes.push({
					id: code.id,
					partnerReward: partnerRewardData,
					...codeData,
				});
				codeCount++;
			} else {
				codes.push({
					id: code.id,
					partnerReward: partnerRewardData,
					user: {
						id: userSnapshot.id,
						...userSnapshot.data(),
					},
					...codeData,
				});
				codeCount++;
			}

			// Aggregate code entity to response body
		}
		return res.status(200).json({
			partnerRewardCodeCount: codeCount,
			partnerRewardCodes: codes,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// Get all Partner Reward Codes by User's ID
router.get("/users/:id", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare user reference
		const userRef = db.collection("users").doc(req.params.id);

		// Query all partner reward codes by user
		const querySnapshot = await db
			.collection("partner_reward_codes")
			.where("user", "==", userRef)
			.get();

		if (querySnapshot.empty) {
			return res.status(200).json({});
		}

		// Retrieve all codes
		let codes = [];
		let codeCount = 0;
		for await (let code of querySnapshot.docs) {
			// Prepare data schema for PartnerReward
			let partnerRewardSnapshot = await code.data().partnerReward.get();
			let partnerSnapshot = await partnerRewardSnapshot.data().partner.get();
			// Get metadata and populate reference for Partner Reward Snapshot
			let partnerRewardMetaData = partnerRewardSnapshot.data();
			partnerRewardMetaData.partner = partnerSnapshot.data();
			partnerRewardMetaData.id = partnerRewardSnapshot.id;
			// Aggregate into object
			let partnerRewardData = Object.assign(
				{ id: partnerRewardSnapshot.id },
				partnerRewardMetaData
			);
			// Delete FK Partner of PartnerReward
			// Assign detailed snapshot to code's data
			let codeData = code.data();
			delete codeData.partner;
			delete codeData.partnerReward;
			// Aggregate code entity to response body
			codes.push({
				id: code.id,
				partnerReward: partnerRewardData,
				...codeData,
			});
			codeCount++;
		}
		return res.status(200).json({
			partnerRewardCodeCount: codeCount,
			partnerRewardCodes: codes,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// READ One PartnerRewardCode by its ID
router.get("/:codeID", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare references
		const partnerRewardCodeRef = db.doc("partner_reward_codes/" + req.params.codeID);

		let partnerRewardCodeSs = await partnerRewardCodeRef.get();

		// Declare partnerReward details
		let partnerRewardSs = await partnerRewardCodeSs.data().partnerReward.get();
		let partnerSnapshot = await partnerRewardSs.data().partner.get();
		let partnerRewardMetaData = partnerRewardSs.data();

		partnerRewardMetaData.partner = partnerSnapshot.data();
		partnerRewardMetaData.partner.id = partnerSnapshot.id;

		let partnerRewardData = Object.assign({ id: partnerRewardSs.id }, partnerRewardMetaData);

		let partnerRewardCodeData = partnerRewardCodeSs.data();
		delete partnerRewardCodeData.partner;
		delete partnerRewardCodeData.partnerReward;

		let partnerRewardCode = {
			id: partnerRewardCodeRef.id,
			partnerReward: partnerRewardData,
			...partnerRewardCodeData,
		};
		return res.status(200).json(partnerRewardCode);
	} catch (error) {
		res.status(400).json({
			messsage: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// CREATE a PartnerRewardCode for PartnerReward
router.post("/", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare references
		const partnerRewardRef = db.doc("partner_rewards/" + req.body.partnerRewardID);

		// Declare body for new code
		let newCode = {
			code: req.body.code,
			redeemStatus: "unused",
			codeExpiryDatetime: helper.stringToDatetime(
				req.body.codeExpiryDatetime,
				"HH:mm:ss DD-MM-YYYY"
			),
			user: null,
			// Un-assigned User-ref until acquired
			partnerReward: partnerRewardRef, // req.body.partnerRewardID
		};

		// Adding Reward Code
		const addedDoc = await db.collection("partner_reward_codes").add(newCode);
		// Transaction to update meta-data
		let dbTransaction = db
			.runTransaction(async (t) => {
				return t.getAll(partnerRewardRef).then((docs) => {
					let partner = docs[0];
					// Read current totalQuantity of the PartnerReward
					let currentTotalQuantity = partner.data().totalQuantity;
					if (!currentTotalQuantity && typeof currentTotalQuantity == "undefined") {
						currentTotalQuantity = 0;
					}

					// Increase total quantity
					t.update(partnerRewardRef, {
						totalQuantity: currentTotalQuantity + 1,
					});
				});
			})
			.catch((error) => {
				console.log(error);
				throw error;
			});

		return res.status(200).json({
			id: addedDoc.id,
			path: `partner_reward_codes/${addedDoc.id}`,
			message: `Partner Reward Codes document ${addedDoc.id} created successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

router.put("/acquire", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare request body
		let { userID, partnerRewardID } = req.body;

		// Reference to the user who acquires the code
		const userRef = db.collection("users").doc(userID);
		const partnerRewardRef = db.collection("partner_rewards").doc(partnerRewardID);
		// Query the PartnerRewardCodes collection that still doesn't have its owner/user
		const querySnapshot = await db
			.collection("partner_reward_codes")
			.where("partnerReward", "==", partnerRewardRef)
			.where("user", "==", null)
			.limit(1)
			.get();

		if (querySnapshot.empty) {
			throw Error("No codes available.");
		}

		const codeRef = db.collection("partner_reward_codes").doc(querySnapshot.docs[0].id);
		let dbTransaction = db
			.runTransaction(async (t) => {
				const docs = await t.getAll(userRef, partnerRewardRef, codeRef);
				let user = docs[0];
				let partnerReward = docs[1];
				let code = docs[2];
				// Retrieve current values
				let currentUserTotalReward = user.data().totalReward;
				let currentPartnerRewardRedeemed = partnerReward.data().redeemed;
				let currentPartnerRewardRewardPrice = partnerReward.data().rewardPrice;
				let expiryDate = new Date(partnerReward.data().expiryDatetime._seconds * 1000);
				let currentCodeUser = code.data().user;
				// Check conditions before updating
				if (currentUserTotalReward < currentPartnerRewardRewardPrice) {
					throw new Error("User does not have enough reward points.");
				}
				if (currentPartnerRewardRedeemed == partnerReward.data().totalQuantity) {
					throw new Error("Partner Reward is currently not available.");
				}
				if (currentCodeUser && typeof currentCodeUser !== "undefined") {
					throw new Error("Partner Reward Code has already been taken, please try again!");
				}
				if (new Date() >= expiryDate) {
					throw new Error("Partner Reward has been expired.");
				}
				if (!currentPartnerRewardRedeemed && typeof currentPartnerRewardRedeemed === "undefined") {
					currentPartnerRewardRedeemed = 0;
				}
				// Minus total reward from User's pocket
				t.update(userRef, {
					totalReward: currentUserTotalReward - currentPartnerRewardRewardPrice,
				});
				// Increase the total number of redeemed-already PartnerRewardCode
				t.update(partnerRewardRef, {
					redeemed: currentPartnerRewardRedeemed + 1,
				});
				// Assign the user to one of the available code
				t.update(codeRef, {
					user: userRef,
				});
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
		return res.status(200).json({
			id: codeRef.id,
			path: `partner_reward_codes/${codeRef.id}`,
			message: `Partner Reward Code document ${codeRef.id} has been acquired by User document ${userRef.id}`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

router.put("/:codeID/users/:userID/redeem", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to PartnerRewardCode
		const codeRef = db.collection("partner_reward_codes").doc(req.params.codeID);
		const userRef = db.collection("users").doc(req.params.userID);

		let codeSnapshot = await codeRef.get();

		// Check if the user is authorized for redeeming this code
		if (codeSnapshot.data().user.id != userRef.id) {
			throw new Error("User does not have permission to redeem this Partner Reward Code.");
		}

		// Check if it has already been redeemed or NOT
		if (codeSnapshot.data().status == "used") {
			throw new Error("This code has already been redeemed.");
		}

		// Check if the code has been expired or not
		let expireTime = new Date(codeSnapshot.data().codeExpiryDatetime._seconds * 1000);
		if (new Date() >= expireTime) {
			throw new Error("Partner Reward Code has been expired.");
		}

		await codeRef.update({
			redeemStatus: "used",
		});
		res.status(200).json({
			id: codeRef.id,
			path: `partner_reward_codes/${codeRef.id}`,
			message: `Partner Reward Code document ${codeRef.id} redeemed sucessfully by User ${userRef.id}`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// UPDATE a Partner Reward Code by ID
router.put("/:codeID", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare references
		const partnerRewardRef = db.doc("partner_rewards" + req.body.partnerRewardID);
		const code = db.doc("partner_reward_codes/" + req.params.codeID);

		// Declare body for new code
		let updatedCode = {
			code: req.body.code,
			redeemStatus: req.body.redeemStatus,
			codeExpiryDatetime: helper.stringToDatetime(
				req.body.codeExpiryDatetime,
				"HH:mm:ss DD-MM-YYYY"
			),
			partnerReward: partnerRewardRef, // req.body.partnerRewardID
		};

		await code.update(updatedCode).then(() => {
			return res.status(200).json({
				id: code.id,
				path: `partner_reward_codes/${code.id}`,
				message: `Partner Reward Code document ${code.id} updated successfully.`,
			});
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

// DELETE a Partner Reward Code by ID
router.delete("/:codeID", async (req, res) => {
	try {
		// Declare DB Schema
		const db = admin.firestore();

		// Declare reference to document
		let codeRef = db.collection("partner_reward_codes").doc(req.params.codeID);
		let codeSnapshot = await codeRef.get();
		let partnerRewardRef = codeSnapshot.data().partnerReward;

		// Delete operation for PartnerRewardCode
		let dbTransaction = db
			.runTransaction(async (t) => {
				const docs = await t.getAll(partnerRewardRef);
				let partnerReward = docs[0];
				let currentTotalQuantity = partnerReward.data().totalQuantity;
				t.update(partnerRewardRef, {
					totalQuantity: currentTotalQuantity - 1,
				});
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
		await codeRef.delete();
		return res.status(200).json({
			id: req.params.codeID,
			path: `partner_reward_codes/${req.params.codeID}`,
			message: `Partner Reward Code document ${req.params.codeID} deleted successfully.`,
		});
	} catch (error) {
		res.status(400).json({
			message: `ERROR! ${error}`,
		});
		console.log(error);
	}
});

module.exports = router;
