import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRout from "./routes/authRoutes.js";
import userRout from "./routes/userRoutes.js";
import verifyAccessToken from "./middlewares/authMiddleware.js";
import checkUserStatus from "./middlewares/userStatusMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes Setup
app.use("/api/auth", authRout);

// Protected Routes
app.use("/api/users", verifyAccessToken, checkUserStatus, userRout);
app.use("/api/profiles", verifyAccessToken, checkUserStatus, profileRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
