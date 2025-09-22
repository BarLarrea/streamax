import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import userRout from "./routes/userRout.js";

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

// Routes setup
app.use("/api/users", userRout);


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
