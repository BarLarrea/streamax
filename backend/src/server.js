import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import authRout from "./routes/authRoutes.js";
import userRout from "./routes/userRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import watchHistoryRoutes from "./routes/watchHistoryRoutes.js";

const app = express();

app.use(
    cors({
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

//Routes setup
app.use("/api/auth", authRout);
app.use("/api/users", userRout);
app.use("/api/profiles", profileRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/watch-history", watchHistoryRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
