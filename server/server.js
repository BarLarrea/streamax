import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import authRout from "./routes/authRout.js";
import userRout from "./routes/userRout.js";
import verifyAccessToken from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

// Routes Setup
app.use("/api/auth", authRout);

//Ptotected Routes
app.use("/api/users", verifyAccessToken, userRout);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
