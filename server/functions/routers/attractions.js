const express = require("express");
const router = express.Router();

// Import Admin SDK
const admin = require("../constants/firebase");

// ---- API for ATTRACTIONS Collection (/api/attractions) ----- //
// Get all attractions
router.get("/", (req, res) => {
	admin
		.firestore()
		.collection("attractions")
		.get()
		.then((data) => {
			let attractions = [];
			data.forEach((doc) => {
				attractions.push({
					id: doc.id,
					...doc.data(),
				});
			});
			return res.json(attractions);
		})
		.catch((error) => {
			console.log("Error: ", error);
		});
});

// tested
router.post("/", (req, res) => {
	const newAttraction = {
		description: req.body.description,
		imageThumbnail: req.body.imageThumbnail,
		reward: req.body.reward,
		name: req.body.name,
		geoPoint: new admin.firestore.GeoPoint(
			req.body.geoPoint["lattitude"],
			req.body.geoPoint["longitude"]
		),
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
	};

	admin
		.firestore()
		.collection("attractions")
		.add(newAttraction)
		.then((doc) => {
			res.json({
				message: `Attraction ${doc.id} created successfully.`,
			});
		})
		.catch((error) => {
			res.status(400).json({
				message: `ERROR 400`,
			});
			console.error(error);
		});
});

router.delete("/:id", async (req, res) => {
	try {
		const db = admin.firestore();

		const attractionRef = db.collection("attractions").doc(req.params.id);

		if (typeof attractionRef == "undefined") {
			return res.status(400).json({
				message: "ERROR 400",
			});
		}
		attractionRef.delete();
		return res.status(200).json({
			message: `Attraction document ${attractionRef.id} deleted successfully`,
		});
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

// tested
router.get("/:id", async (req, res) => {
	try {
		let db = admin.firestore();

		let attractionRef = await db
			.collection("attractions")
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
			return res.json(attraction);
		}
		return res.json({ error: "haizza " });
	} catch (err) {
		console.log(err);
	}
});

// tested
router.put("/:id", (req, res) => {
	admin
		.firestore()
		.collection("attractions")
		.doc(req.params.id)
		.update({
			count: admin.firestore.FieldValue.increment(req.body.num),
			name: req.body.name,
			description: req.body.description,
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
				message: "problem occcured",
			});
			console.error(err);
		});
});

//

// tested
router.get("/pages/:page", (req, res) => {
	const begin = req.params.page - 1;
	const pagesize = 3;
	const end = req.params.page;
	admin
		.firestore()
		.collection("attractions")
		.get()
		.then((data) => {
			let i = 0;
			let attractions = [];
			data.forEach((doc) => {
				if (i >= begin * pagesize && i <= end * pagesize) {
					attractions.push({
						id: doc.id,
						...doc.data(),
					});
				}
				i++;
			});
			console.log(begin * pagesize);
			console.log(end * pagesize);
			return res.json(attractions);
		})
		.catch((err) => {
			console.error(err);
		});
});

module.exports = router;
