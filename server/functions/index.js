const functions = require("firebase-functions");

const admin = require("firebase-admin")

const express = require('express')

const app = express()

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

app.get('/attractions', (req, res) => {
    admin.firestore().collection('attractions').get()
    .then((data) => {
        let attractions = []
        data.forEach((doc) => {
            attractions.push({
                id: doc.id,
                ...doc.data()
            })
        })
        return res.json(attractions);
    })
    .catch(err => {
        console.error(err)
    })
})

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
    .catch((err) => {
      console.error(err);
    });
});

app.post('/attractions', (req, res) => {
    const newAttraction = {
        description: req.body.description,
        imageThumbnail: req.body.imageThumbnail,
        reward: req.body.reward,
        name: req.body.name,
        geoPoint: new admin.firestore.GeoPoint(req.body.geoPoint['lattitude'], req.body.geoPoint['longitude']),
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    admin.firestore()
    .collection('attractions')
    .add(newAttraction)
    .then((doc) => {
        res.json({
            message: `document ${doc.id} created successfully.`
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
        console.error(err)
    })
})

// Exports API
exports.api = functions.region("asia-east2").https.onRequest(app);