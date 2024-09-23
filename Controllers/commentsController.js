const db = require('../config/db');

exports.createComment = (req, res) => {
    const { content } = req.body;
    const { user } = req.session;
    const userId = user.userId; 
    const postId = req.params.post_id;
    const query = `INSERT INTO Comments (post_id, user_id, content) VALUES (?, ?, ?)`;
    db.query(query, [postId, userId, content], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creando comentario' });
        res.status(201).json({ message: 'Comentario añadido' });
    });
};

exports.getCommentsByPost = (req, res) => {
    const postId = req.params.post_id;
    const query = `SELECT * FROM Comments WHERE post_id = ? ORDER BY created_at DESC`;

    db.query(query, [postId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error obteniendo comentarios' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron comentarios para esta publicación' });
        }
        res.status(200).json(results);
    });
};

