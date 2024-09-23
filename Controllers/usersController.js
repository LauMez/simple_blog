const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.getLogin = async (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }

    res.render('users/login', {
        title: 'Iniciar Sesión',
        user: req.user || null 
    });
};

exports.getRegister = (req, res) => {
    res.render('users/register', {
        title: 'Registrarse',
        user: req.user || null
    });
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
 
    bcryptjs.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({ message: 'Error generando salt' });
        }

        bcryptjs.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error encriptando la contraseña' });
            }

            const query = `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`;
            db.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creando el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            });
        });
    });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Users WHERE username = ?`;
    db.query(query, [username], async (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        const user = result[0];
        const match = await bcryptjs.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res
        .cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 
        })
        .json({ user, token });
    });
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('access_token').redirect('/users/login')
    } catch(error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

