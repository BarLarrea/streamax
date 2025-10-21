import mongoose from "mongoose";

// Validation helper for MongoDB ObjectIds
export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
