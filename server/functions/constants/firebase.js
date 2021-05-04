const admin = require("firebase-admin");

// Initialize our project application
admin.initializeApp();

// Set up database connection
module.exports = admin;
