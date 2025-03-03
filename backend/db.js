const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.Mongo_URL)

const UserSchema = new mongoose.Schema({
    usernName: String,
    firstName: String,
    lastName: String,
    password: String
})

const User = mongoose.model('User',UserSchema);

module.exports = {
	User
}