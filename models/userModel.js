import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: false, required: true},
    location: {type: String },
    password: {type: String, required: true },
    // TODO: relationship with expenses
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
