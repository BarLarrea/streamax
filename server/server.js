import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";

dotenv.config();
const app = express();

connectDB();

app.listen(3000, () => console.log("server is running on port 3000"));

app.get("/", (req, res) => res.send("Hellow StreaMax"));
