const functions = require("firebase-functions");
const express = require("express");
const Cors = require("cors");
const app = express().use(Cors({ origin: true }));

// Import seperated routers
const Users = require("./routers/users");
const Attractions = require("./routers/attractions");
const Friendships = require("./routers/friendships");
const FriendRequests = require("./routers/friendrequests");
const Reviews = require("./routers/reviews");
const Like = require("./routers/like");
const Reply = require("./routers/reply");
const PartnerRewards = require("./routers/partner-rewards");
const SystemRewards = require("./routers/system-rewards");
const SystemRewardCopies = require("./routers/system-reward-copies");
const PartnerRewardCodes = require("./routers/partner-reward-codes");
const Partners = require("./routers/partners");

// Route API addresses
app.use("/users", Users);
app.use("/attractions", Attractions);
app.use("/friendships", Friendships);
app.use("/friendrequests", FriendRequests);
app.use("/reviews", Reviews);
app.use("/like", Like);
app.use("/reply", Reply);

// Rewards Routes
app.use("/partner-rewards", PartnerRewards);
app.use("/system-rewards", SystemRewards);
app.use("/system-reward-copies", SystemRewardCopies);
app.use("/partner-reward-codes", PartnerRewardCodes);
app.use("/partners", Partners);

// Exports REST API
exports.api = functions.region("asia-east2").https.onRequest(app);
