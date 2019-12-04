const express = require("express");
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
const {reviewSchema, gameSchema, userSchema} = require('./schemas');
const {
    postGameHandler, 
    getGameHandler, 
    getSpecificGameHandler, 
    postReviewHandler, 
    getReviewByGameHandler
} = require('./handlers');

const app = express();

app.use(express.json());

//const mongoEndpoint = "mongodb://localhost:27017/test"

// For later when deploying
const mongoEndpoint = process.env.MONGOADDR;

const Review = mongoose.model("review", reviewSchema);
const Game = mongoose.model("game", gameSchema);
const User = mongoose.model("user",userSchema);

const connect = () => {
	mongoose.connect(mongoEndpoint);
}

const RequestWrapper = (handler, SchemeAndDbForwarder) => {
	return (req, res) => {
		handler(req, res, SchemeAndDbForwarder);
	}
}

// Endpoints for the messaging microservice
app.post("/v1/games", RequestWrapper(postGameHandler, {Game}));
app.get("/v1/games", RequestWrapper(getGameHandler, {Game}));
app.get("/v1/games/:gameid", RequestWrapper(getSpecificGameHandler, {Game}));
app.post("/v1/games/reviews", RequestWrapper(postReviewHandler, {Review}));
app.get("/v1/games/reviews/:gameid", RequestWrapper(getReviewByGameHandler, {Review}));
app.all("/v1/games", send405)
app.all("/v1/game/:gameid", send405)
app.all("/v1/reviews", send405)
app.all("/v1/reviews/:gameid", send405)

function send405(req, res, next) {
	res.setHeader('content-type', 'text/plain');
	res.status(405).send("unaccepted method");
}

connect();
mongoose.connection.on('error', console.error)
	.on('disconnected', connect)
    .once('open', main);
    
async function main() {
    app.listen(port, "", () => {
        console.log(`server listening ${port}`);
    });
}
