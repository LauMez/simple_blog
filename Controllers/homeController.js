const db = require('../config/db');

exports.home = (req, res) => {
    const query = `SELECT * FROM Posts ORDER BY created_at DESC LIMIT 5`; 
    const { user } = req.session;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error obteniendo publicaciones' });
        res.render('index', {
            title: 'Inicio',
            user,
            posts: results 
        });
    });
};
