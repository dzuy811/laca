const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");

// ---- API for LIKES collection (/api/like) ---- //
// tested
router.post("/", (req, res) => {
	const newLike = {
		uid: admin.firestore().doc(`users/${req.body.uid}`),
		rid: req.body.rid,
	};

	admin
		.firestore()
		.collection("like")
		.add(newLike)
		.then((doc) => {
			res.json({
				message: `document ${doc.id} created successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

// tested
router.get("/reviews/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db.collection("like").where("rid", "==", `${req.params.id}`).get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
router.get("/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("like")
			.where("__name__", "==", `${req.params.id}`)
			.get();
		if (!attractionRef.empty) {
			let attraction = [];
			attractionRef.forEach((a) => {
				attraction.push({
					id: a.id,
					...a.data(),
				});
			});
			return res.json(attraction[0]);
		}
		return res.json({ error: "haizza" });
	} catch (err) {
		console.log(err);
	}
});

// tested
router.delete("/:id", async (req, res) => {
	try {
		const LikeRef = admin.firestore().collection("like").doc(req.params.id);
		LikeRef.get().then((snap) => {
			if (snap.exists) {
				LikeRef.delete().then(() => {
					res.json({
						message: `document ${req.params.id} deleted`,
					});
				});
			} else {
				res.json({
					message: "document not exist",
				});
			}
		});
	} catch (err) {
		res.status(400).json({
			error: err,
		});
		console.error(err);
	}
});

module.exports = router;
