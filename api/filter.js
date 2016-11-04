exports.authorize = function(req, res, next) {
    if (!req.session.user_id) {
        res.status(503);
        res.json({error_code: '30000'});
    } else {
        next();
    }
}