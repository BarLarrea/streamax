import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRout from "./routes/authRoutes.js";
import userRout from "./routes/userRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

//Routes setup
app.use("/api/auth", authRout);
app.use("/api/users", userRout);
app.use("/api/profiles", profileRoute);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
