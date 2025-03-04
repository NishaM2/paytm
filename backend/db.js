const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.Mongo_URL)

const UserSchema = new mongoose.Schema({
    usernName: String,
    firstName: String,
    lastName: String,
    password: String
})

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
   },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User',UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
	User,
    Account
}