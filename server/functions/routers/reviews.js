const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
// ---- API for REVIEWS Collection (/api/reviews) ---- //
// tested
router.post("/", (req, res) => {
	const newReview = {
		content: req.body.content,
		rating: req.body.rating,
		uid: admin.firestore().doc(`users/${req.body.uid}`),
		timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
		aid: admin.firestore().doc(`attractions/${req.body.aid}`),
		likeCount: 0,
	};

	admin
		.firestore()
		.collection("reviews")
		.add(newReview)
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
router.get("/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("reviews")
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
		return res.json({ error: "dumaduy" });
	} catch (err) {
		console.log(err);
	}
});

// tested
router.get("/attractions/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db.collection("reviews").where("aid", "==", `${req.params.id}`).get();
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
		return res.json({ error: "dumaduy" });
	} catch (err) {
		console.log(err);
	}
});

// tested
router.put("/:id", (req, res) => {
	admin
		.firestore()
		.collection("reviews")
		.doc(req.params.id)
		.update({
			content: req.body.content,
			rating: req.body.rating,
		})
		.then((doc) => {
			res.json({
				message: `document ${doc.id} updated successfully`,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
			console.error(err);
		});
});

module.exports = router;
