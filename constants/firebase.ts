import firebase from "firebase";

export const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: "laca-59b8c.firebaseapp.com",
	projectId: "laca-59b8c",
	storageBucket: "laca-59b8c.appspot.com",
	messagingSenderId: "484967488564",
	appId: "1:484967488564:web:fc10713e68413508b9be61",
	measurementId: "G-NY7NE9KG7V",
	databaseURL: "https://laca-59b8c-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);
