import Content from "../models/contentModel.js";

// ----- CREATE -----
export const createContent = async (data) => {
    return await Content.create(data);
};

// ----- READ & QUERY -----
export const getContentById = async (contentId) => {
    if (!momgoose.Types.ObjectId.isValid(contentId)) {
        return null;
    }
    return await Content.findById(contentId);
};

export const getAllContents = async (filters = {}, options = {}) => {
    try {
        const query = Content.find(filters); // built the query object

        // Apply options (sort, limit, skip, select)
        if (options.sort) query.sort(options.sort);
        if (options.limit) query.limit(options.limit);
        if (options.skip) query.skip(options.skip);
        if (options.select) query.select(options.select);

        const results = await query.exec(); // do the actual query
        return results;
    } catch (error) {
        console.error("Error fetching contents:", error);
        throw error;
    }
};

export const getContentsByGenre = async (genre) => {
    return await Content.find({ genres: { $in: [genre] } });
};

// ----- Search -----
// export const searchContents = async (query) => {
//     const regex = new RegExp(query, "i");
//     return await Content.find({
//         $or: [{ title: regex }, { description: regex }, { genres: regex }]
//     });
// };

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
