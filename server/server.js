import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

app.get("/", (req, res) => res.send("Hellow StreaMax"));

app.listen(3000, () => console.log("server is running on port 3000"));
