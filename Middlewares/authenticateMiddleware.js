const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const { user } = req.session;
    
    if (!user) {
        return res.status(403).redirect('/');
    }

    next();
};