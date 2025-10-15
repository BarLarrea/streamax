import Content from "../models/contentModel.js";

// ----- CREATE -----
export const createContent = async (data) => {
    return await Content.create(data);
};

// ----- READ -----
export const getContentById = async (contentId) => {
    return await Content.findById(contentId);
};

export const getAllContents = async (filters = {}) => {
    return await Content.find(filters);
};

// export const searchContents = async (query) => {
//     const regex = new RegExp(query, "i");
//     return await Content.find({
//         $or: [{ title: regex }, { description: regex }, { genres: regex }]
//     });
// };

export const getContentsByGenre = async (genre) => {
    return await Content.find({ genres: { $in: [genre] } });
};

// ----- HIERARCHY -----
export const getSeasonsBySeriesId = async (seriesId) => {
    return await Content.find({ seriesId, type: "season" }).sort({
        seasonNumber: 1
    });
};

export const getEpisodesBySeasonId = async (seasonId) => {
    return await Content.find({ seasonId, type: "episode" }).sort({
        episodeNumber: 1
    });
};

// ----- UPDATE / DELETE -----
export const saveContent = async (content) => {
    return await content.save();
};

export const updateContent = async (id, data) => {
    return await Content.findByIdAndUpdate(
        id,
        data,
        { new: true },
        { runValidators: true } // Ensure data adheres to schema
    );
};

export const deleteContent = async (id) => {
    return await Content.findByIdAndDelete(id);
};
