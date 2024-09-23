const express = require('express');
const {json} = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const homeRoutes = require('./routes/homeRoutes');
const { authenticateToken } = require('./Middlewares/authenticateMiddleware');

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(json());
app.use(cookieParser());
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };
  
    if (token) {
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.session.user = data;
      } catch (error) {
        console.error('Invalid token:', error.message);
      }
    }
  
    next();
});

// Rutas
app.use('/users', userRoutes);  // Rutas de usuarios (registro, login)
app.use('/posts', authenticateToken, postRoutes);  // Rutas de publicaciones, autenticación requerida
app.use('/comments', authenticateToken, commentRoutes);  // Rutas de comentarios, autenticación requerida
app.use('/', homeRoutes);
// Manejar errores 404
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
