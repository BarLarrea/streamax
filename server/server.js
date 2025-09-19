import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import userRout from "./routes/userRout.js";

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

// Routes setup
app.use("api/register", userRout);

app.listen(3000, () => console.log("server is running on port 3000"));
