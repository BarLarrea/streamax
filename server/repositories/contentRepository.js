import Content from "../models/contentModel.js";

export const findContentById = async (contentId) => {
    return await Content.findById(contentId);
};
