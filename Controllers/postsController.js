const db = require('../config/db');

exports.getCreate = (req, res) => {
    const { user } = req.session;
    res.render('posts/create', {
        title: 'Crear Publicación',
        user 
    });
};

exports.getPost = (req, res) => {
    const { user } = req.session;
    const postId = req.params.id;
    const query = `SELECT Posts.*, Users.username AS author FROM Posts JOIN Users ON Posts.user_id = Users.id WHERE Posts.id = ?`;

    db.query(query, [postId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        const post = results[0];
        res.render('posts/index', {
            title: post.title,
            post,  
            user
        });
    });
};

exports.getEdit = (req, res) => {
    const postId = req.params.id;
    const { user } = req.session;
    const query = `SELECT * FROM Posts WHERE id = ? AND user_id = ?`;

    db.query(query, [postId, user.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        const post = results[0];
        res.render('posts/edit', { title: 'Editar Publicación', post, user });
    });
};

exports.getAllPosts = (req, res) => {
    const query = `SELECT * FROM Posts`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error obteniendo publicaciones' });
        res.json(results);
    });
};

exports.createPost = (req, res) => {
    const { title, content } = req.body;
    const { user } = req.session;
    const userId = user.userId; 
    const query = `INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)`;
    db.query(query, [userId, title, content], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creando publicación' });
        res.status(201).json({ message: 'Publicación creada' });
    });
};

exports.updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = `UPDATE Posts SET title = ?, content = ? WHERE id = ?`;

    db.query(query, [title, content, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error actualizando la publicación' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.status(200).json({ message: 'Publicación actualizada correctamente' });
    });
};

exports.deletePost = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Posts WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error eliminando la publicación' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.status(200).json({ message: 'Publicación eliminada correctamente' });
    });
};

