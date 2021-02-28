const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    id: String,
    messages: { type: Number, default: 5 },
    admin: Boolean,
});

module.exports = mongoose.model("User", userSchema);
