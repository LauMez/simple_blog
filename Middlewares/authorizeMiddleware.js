const db = require('../config/db');

exports.authorizePost = (req, res, next) => {
    const { user } = req.session;
    const postId = req.params.id;
    const userId = user.userId;
    
    const query = `SELECT user_id FROM Posts WHERE id = ?`;
    db.query(query, [postId], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: 'Publicación no encontrada' });
        if (result[0].user_id !== userId) return res.status(403).json({ message: 'No autorizado' });
        next();
    });
};
