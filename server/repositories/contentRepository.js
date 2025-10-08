import Content from "../models/contentModel.js";

export const createContent = async (data) => {
    return await Content.create(data);
}


export const getContentById = async (contentId) => {
    return await Content.findById(contentId);
};

export const getdAllContents = async () => {
    return await Content.find();
};

export const saveContent = async (content) => {
    return await content.save();
};

