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

// tested 
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

// tested 
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


// tested 
app.get("/attractions/:id", async (req, res) => {
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('attractions').where('__name__', '==', `${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction);
        }
        return res.json({ "error": "haizza " })
    } catch (err) {
        console.log(err)
    }

})

// tested 
app.put("/attractions/:id", (req, res) => {
    admin.firestore()
        .collection("attractions")
        .doc(req.params.id)
        .update({
            count: admin.firestore.FieldValue.increment(req.body.num),
			name: req.body.name,
			description : req.body.description,
            rating : req.body.rating
        })
        .then((doc) => {
            res.json({
                message: `document ${doc.id} updated successfully`

            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                message : "problem occcured"
            })
            console.error(err)
        })
})

// 

// tested
app.get("/attractions/pages/:page", (req, res) => {
    const begin = req.params.page - 1
    const pagesize = 3
    const end = req.params.page
    admin.firestore().collection('attractions').get()
        .then((data) => {
            let i = 0
            let attractions = []
            data.forEach((doc) => {
                if (i >= begin * pagesize && i <= end * pagesize) {
                    attractions.push({
                        id: doc.id,
                        ...doc.data()
                    })
                }
                i++;
            })
            console.log(begin * pagesize)
            console.log(end * pagesize)
            return res.json(attractions);
        })
        .catch(err => {
            console.error(err)
        })

})




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
		const country = "Vietnam";
		let phone;

		// Normalize Vietnam's phone format for international code format
		if (country == "Vietnam") {
			phone = "+84" + req.query.phone.replace("0", "");
		}

		// Query for finding users by phone's number
		const searchQuery = await usersRef.where("phoneNumber", "==", phone).get();
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
			// Retrieve user's object from document's reference
			const userRef = await history.data().user.get();
			const user = userRef.data();
			// Retrieve attraction's from document's reference
			const attractionRef = await history.data().attraction.get();
			const attraction = attractionRef.data();
			// Check if the attraction and user are available or not
			if (attraction && user && typeof attraction !== "undefined" && typeof user !== "undefined") {
				console.log("Document User and Attraction exist!");
			} else {
				throw new Error("Not found error");
			}
			// Push well-structured (including detailed user, detailed attraction) History object to the list
			histories.push({
				id: history.id,
				createdAt: history.data().createdAt,
				user: {
					id: userRef.id,
					...user,
				},
				attraction: {
					id: attractionRef.id,
					...attraction,
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

app.get("/users/:id/histories", async (req, res) => {
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
		let histories = [];
		for await (let history of historyQuery.docs) {
			// Retrieve attraction's object from document reference
			const attractionRef = await history.data().attraction.get();
			const attraction = attractionRef.data();
			// Check if there's any empty query
			if (attraction || typeof attraction !== "undefined") {
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
					id: attractionRef.id,
					...attraction,
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

app.post("/users", (req, res) => {
  const newUser = {
    phoneNumber: req.body.phoneNumber,
    name: req.body.name,
    gender: req.body.gender,
    urlAvatar: req.body.urlAvatar
  };

  admin
    .firestore()
    .collection("users")
    .add(newUser)
    .then((doc) => {
      res.json({
        message: `document ${doc.id} created successfully.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
      console.error(err);
    });
});

// reviews API 
// tested
app.post("/reviews", (req, res) => {
    const newReview = {
        content: req.body.content,
        rating: req.body.rating,
        uid: admin.firestore().doc(`users/${req.body.uid}`),
        timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
        aid:admin.firestore().doc(`attractions/${req.body.aid}`),
        likeCount: 0

    }

    admin.firestore()
        .collection("reviews")
        .add(newReview)
        .then((doc) => {
            res.json({
                message: `document ${doc.id} created successfully`
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
            console.error(err)
        })
})

// tested
app.get("/reviews/:id", async (req, res) => {
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('reviews').where('__name__', '==', `${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction[0]);
        }
        return res.json({ "error": "dumaduy" })
    } catch (err) {
        console.log(err)
    }
})

// tested
app.get("/reviews/attractions/:id", async (req,res) => {
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('reviews').where('aid', '==', `${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction);
        }
        return res.json({ "error": "dumaduy" })
    } catch (err) {
        console.log(err)
    }
})


// tested
app.put("/reviews/:id", (req,res) => {
	admin.firestore()
        .collection("reviews")
        .doc(req.params.id)
        .update({
            content: req.body.content,
			rating : req.body.rating

        })
        .then((doc) => {
            res.json({
                message: `document ${doc.id} updated successfully`

            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
            console.error(err)
        })
    
})

// like api  


// tested
app.post("/like", (req,res) =>{
    const newLike = {
        uid :admin.firestore().doc(`users/${req.body.uid}`),
        rid: admin.firestore().doc(`reviews/${req.body.rid}`)
    }

    admin.firestore()
    .collection("like")
    .add(newLike)
    .then((doc) => {
        res.json({
            message:`document ${doc.id} created successfully`
        })
    })
    .catch((err) =>{
        res.status(500).json({
            error: err
        })
        console.error(err)
    })
})


// tested
app.get("/like/reviews/:id", async (req,res) =>{
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('like').where("rid","==",`${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction);
        }
        return res.json({ "error": "haizza" })
    } catch (err) {
        console.log(err)
    }
})


// tested
app.get("/like/:id", async (req,res) =>{
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('like').where('__name__', '==', `${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction[0]);
        }
        return res.json({ "error": "haizza" })
    } catch (err) {
        console.log(err)
    }
})


// tested
app.delete("/like/:id", async (req,res) => {
    try {
        const LikeRef = admin.firestore().collection("like").doc(req.params.id)
        LikeRef.get()
        .then((snap) => {
            if(snap.exists){
                LikeRef.delete()
                .then(() => {
                    res.json({
                        message : `document ${req.params.id} deleted`
                    })
                })
            }
            else {
                res.json({
                    message : "document not exist"
                })
            }
        })
	
    }
    catch (err) {
        res.status(400).json({
            error: err
        })
        console.error(err)
    }
	
})

// reply api

// tested
app.post("/reply", (req, res) => {
    const newReply = {
        rid: admin.firestore().doc(`reviews/${req.body.rid}`),
        content: req.body.content,
        timeCreated: admin.firestore.Timestamp.fromDate(new Date()),
        uid: admin.firestore().doc(`users/${req.body.uid}`)
    }
    admin.firestore()
    .collection("reply")
    .add(newReply)
    .then((doc) => {
        res.json({
            message: `document ${doc.id} created successfully`
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
        console.error(err)
    })
})


//
app.get("/reply/reviews/:id", async (req,res) => {
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('reply').where("rid","==",`${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction);
        }
        return res.json({ "error": "haizza" })
    } catch (err) {
        console.log(err)
    }
})

// tested
app.get("/reply/:id", async (req,res) => {
    try {
        let db = admin.firestore();

        let attractionRef = await db.collection('reply').where("__name__","==",`${req.params.id}`).get();
        if (!attractionRef.empty) {
            let attraction = []
            attractionRef.forEach(a => {
                attraction.push({
                    id: a.id,
                    ...a.data()
                })
            })
            return res.json(attraction[0]);
        }
        return res.json({ "error": "haizza" })
    } catch (err) {
        console.log(err)
    }
})

// tested
app.put("/reply/:id",(req,res) => {
    try {
        let db = admin.firestore();

        db.collection("reply")
        .doc(`${req.params.id}`)
        .update({
            content: req.body.content
        })
        .then(() => {
            res.json({
                message : `document ${req.params.id} updated successfully `
            })
        })

        
    } catch (err) {
        console.log(err)
    }
})


// tested
app.delete("/reply/:id",(req,res) => {
    try {
        const LikeRef = admin.firestore().collection("reply").doc(req.params.id)
        LikeRef.get()
        .then((snap) => {
            if(snap.exists){
                LikeRef.delete()
                .then(() => {
                    res.json({
                        message : `document ${req.params.id} deleted`
                    })
                })
            }
            else {
                res.json({
                    message : "document not exist"
                })
            }
        })
	
    }
    catch (err) {
        res.status(400).json({
            error: err
        })
        console.error(err)
    }
})

// Exports API
exports.api = functions.region("asia-east2").https.onRequest(app);
