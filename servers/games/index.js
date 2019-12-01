const express = require("express");
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
const {reviewSchema, gameSchema, userSchema} = require('./schemas');

const amqp = require('amqplib/callback_api');

const app = express();

app.use(express.json());

const mongoEndpoint = "mongodb://localhost:27017/test"

// For later when deploying
//const mongoEndpoint = process.env.MONGOADDR;

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

connect();
mongoose.connection.on('error', console.error)
	.on('disconnected', connect)
	.once('open', main);
