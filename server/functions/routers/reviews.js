const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");
// ---- API for REVIEWS Collection (/api/reviews) ---- //
// tested
router.post("/", (req, res) => {
	let newReview = {
		content: req.body.content,
		rating: req.body.rating,
		uid: admin.firestore().doc(`users/${req.body.uid}`),
		timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
		aid: req.body.aid,
		likeCount: 0,
		images: [],
		replyCount: 0
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
		let attractionRef = await db.collection("reviews").where("aid", "==", `${req.params.id}`).orderBy('timeCreated').get();

		if (!attractionRef.empty) {
			let attraction = [];

			for await (let a of attractionRef.docs) {
				const userRef = await a.data().uid.get();
				const useInfo = await userRef.data();
				if (useInfo && typeof useInfo != "undefined" && typeof a != "undefined" && a) {
					console.log("it wworked bae uhh");
				} else {
					throw new Error("one of the data is not found");
				}

				
				
				attraction.push({
					id: a.id,
					comment: {
						id: a.id,
						...a.data(),
					},
					userInfo: {
						id: userRef.id,
						...useInfo,
					},
					
				});
			}
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

router.put("/updateAll",async (req,res)=>{
	try {
		let reviewsAll = admin.firestore().collection("reviews").get()

		for await( let rev of reviewsAll.docs){
			const revRef = await rev.get();
			try {
				revRef.update({ 
					replyCount : 0
				})
			} catch(error) {
				console.log("it didn't work")
				console.log(error)
			}
			

		}

		res.json("updated all the docs")
		
	} catch (err) {
		console.log(err)
	}
})

module.exports = router;
