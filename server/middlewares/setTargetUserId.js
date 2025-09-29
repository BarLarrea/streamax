const setTargetUserId = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.targetUserId = req.user.id;
    } else {
        req.targetUserId = req.params.id;
    }
    next();
};

export default setTargetUserId;
