const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");

// ---- API for REPLY Collection (/api/reply) ---- //
// tested
router.post("/", (req, res) => {
	const newReply = {
		rid: admin.firestore().doc(`reviews/${req.body.rid}`),
		content: req.body.content,
		timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
		uid: admin.firestore().doc(`users/${req.body.uid}`),
	};
	admin
		.firestore()
		.collection("reply")
		.add(newReply)
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

//
router.get("/reviews/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db.collection("reply").where("rid", "==", `${req.params.id}`).get();
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
			.collection("reply")
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
router.put("/:id", (req, res) => {
	try {
		let db = admin.firestore();

		db.collection("reply")
			.doc(`${req.params.id}`)
			.update({
				content: req.body.content,
			})
			.then(() => {
				res.json({
					message: `document ${req.params.id} updated successfully `,
				});
			});
	} catch (err) {
		console.log(err);
	}
});

// tested
router.delete("/:id", (req, res) => {
	try {
		const LikeRef = admin.firestore().collection("reply").doc(req.params.id);
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
