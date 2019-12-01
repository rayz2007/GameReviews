const Schema =require('mongoose').Schema
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new Schema({
    _id: false,
    id: {type: Number, required: true},
    userName: {type: String, required:true},
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    photoURL: {type: String, required:true}
});

const reviewSchema = new Schema({
    gameID: {type: String, required: true},
    rating: {type: Number, required: true},
    body: {type: String, required: true},
    createdAt: {type: Date, required: true},
    creator: {type: userSchema, required: true},
    editedAt: Date
});

const gameSchema = new Schema({
    name: {type: String, required: true, unique: true},
    genre: {type: String, required: true},
    publisher: {type: String, required: true},
    developer: {type: String, required: true},
    year: {type: Number, required: true},
    creator: {type: userSchema, required: true}
});



reviewSchema.plugin(AutoIncrement, {inc_field: 'reviewId'});

module.exports = {gameSchema, reviewSchema, userSchema};