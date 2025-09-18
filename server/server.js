import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import User from "./models/userModel.js";

dotenv.config();
const app = express();

connectDB();

app.listen(3000, () => console.log("server is running on port 3000"));

app.get("/", (req, res) => res.send("Hellow StreaMax"));

const testUser = new User({
    userName: "Bar",
    email: "bar@example.com",
    hashedPassword: "123456"
});

try {
    await testUser.save();
} catch (e) {
    console.error(e);
}
