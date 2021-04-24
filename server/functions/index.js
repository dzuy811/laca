const functions = require("firebase-functions");

const admin = require("firebase-admin");

const express = require("express");
const Cors = require("cors");
const { user } = require("firebase-functions/lib/providers/auth");
const app = express().use(Cors({ origin: true }));

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// ---- API for Attraction Collection ----- //
app.get("/attractions", (req, res) => {
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
			console.log("Error: ", err);
		});
});

app.post("/attractions", (req, res) => {
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
		.catch((err) => {
			res.status(400).json({
				message: `ERROR 400`,
			});
			console.error(err);
		});
});

// ---- API for User Collection ----- //
app.get("/users", (req, res) => {
	admin
		.firestore()
		.collection("users")
		.get()
		.then((data) => {
			let users = [];
			data.forEach((doc) => {
				users.push({
					id: doc.id,
					...doc.data(),
				});
			});
			return res.json(users);
		})
		.catch((error) => {
			res.status(400).json({
				message: `ERROR ${error}`,
			});
			console.log(error);
		});
});

app.get("/users/search", async (req, res) => {
	try {
		// create reference for User collection on Firestore
		const usersRef = admin.firestore().collection("users");
		const { phone } = req.query;
		const country = "Vietnam";
		let phoneNorm;

		// Normalize Vietnam's phone format for international code format
		if (country == "Vietnam") {
			phoneNorm = "+84" + phone.replace("0", "");
		}

		// Query for finding users by phone's number
		const searchQuery = await usersRef.where("phoneNumber", "==", phoneNorm).get();
		if (searchQuery.empty) {
			console.log(req.query.phone);
			res.status(200).json({});
			return;
		}
		const searchUser = searchQuery.docs[0];
		let user = {
			id: searchUser.id,
			...searchUser.data(),
		};

		return res.json(user);
	} catch (error) {
		res.status(400).json({
			message: "ERROR 400",
		});
		console.log(error);
	}
});

app.get("/users/histories", async (req, res) => {
	try {
		const db = admin.firestore();
		const historiesQuery = await db.collection("histories").get();

		let histories = [];

		for await (let history of historiesQuery.docs) {
			const attractionRef = await history.data().attraction.get();
			const attractionQuery = db.doc(attractionRef.ref.path);
			const attraction = await attractionQuery.get();

			const userRef = await history.data().user.get();
			const userQuery = db.doc(userRef.ref.path);
			const user = await userQuery.get();

			if (attraction.exists && user.exists) {
				console.log("Document User and Attraction exist!");
			} else {
				throw new Error("Not found error");
			}
			histories.push({
				id: history.id,
				createdAt: history.data().createdAt,
				user: {
					...user.data(),
				},
				attraction: {
					...attraction.data(),
				},
			});
		}
		return res.json(histories);
	} catch (error) {
		console.log(error);
	}
});

app.post("/users/histories", async (req, res) => {
	try {
		// Declare firestore authentication
		const db = admin.firestore();

		// Declare schema for post request object of History
		const newHistory = {
			createdAt: admin.firestore.Timestamp.fromDate(new Date()),
			user: db.doc("users/" + req.body.userID),
			attraction: db.doc("attractions/" + req.body.attractionID),
		};

		// Add new History object to Firestore (POST Method)
		db.collection("histories")
			.add(newHistory)
			.then((doc) => {
				res.json({
					message: `History ${doc.id} created successfully`,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

app.get("/user/:id/histories", async (req, res) => {
	try {
		// Declare firestore authentication
		const db = admin.firestore();

		// Queries to collections
		const userQuery = db.collection("users").doc(req.params.id);

		// Compare the the reference between the stored value in 'history' collection and the 'user' collection
		const historyQuery = await db
			.collection("histories")
			.where("user", "==", userQuery)
			.get()
			.then();

		// Check if the query matches any document
		if (historyQuery.empty) {
			return res.status(204).json({ message: "user's histories not found" });
		}

		// read the reference from user's query
		const userRef = await userQuery.get();

		// declare reference to detailed object
		let user = {
			id: userRef.id,
			...userRef.data(),
		};
		console.log(user);
		let histories = [];

		for await (let history of historyQuery.docs) {
			const attractionRef = await history.data().attraction.get();
			const attractionQuery = db.doc(attractionRef.ref.path);
			const attraction = await attractionQuery.get();
			if (attraction.exists) {
				console.log("Attraction exist");
			} else {
				console.log(`Attraction not exist`);
				throw new Error("Not found error");
			}
			histories.push({
				id: history.id,
				createdAt: history.data().createdAt,
				user: {
					...user,
				},
				attraction: {
					attraction: attraction.id,
					...attraction.data(),
				},
			});
		}
		return res.json(histories);
	} catch (error) {
		res.status(400).json({
			message: `ERROR 400`,
		});
		console.log(error);
	}
});

// Exports API
exports.api = functions.region("asia-east2").https.onRequest(app);
