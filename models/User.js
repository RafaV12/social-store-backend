const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a valid username"],
        maxlength: 50,
        collation: { locale: "en_US", strength: 2 },
        unique: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 chars"],
    },
});

UserSchema.plugin(uniqueValidator, { message: "already taken." });

module.exports = model("User", UserSchema);
