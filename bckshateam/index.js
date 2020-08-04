require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const postsRouter = require('./api/recursos/posts/posts.routes');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');
const amistadesRouter = require('./api/recursos/amistades/amistades.routes');
const comentariosRouter = require('./api/recursos/comentarios/comentarios.routes');
const likesRouter = require('./api/recursos/likes/likes.routes');
const logger = require('./utils/logger');
const authJWT = require('./api/libs/auth');
const config = require('./config');
const errorHandler = require('./api/libs/errorHandler');

const passport = require('passport');
passport.use(authJWT);

// MongoDB -> NoSQL -> No hay tablas, sino colecciones de documentos
mongoose.connect(process.env.MONGODB_URI, {
  // Estos settings apagan warnings de mongoose
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on('error', () => {
  logger.error('Falló la conexión a mongodb');
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/*', limit: '8mb' }));
app.use(
  morgan('short', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
);

// Servir archivos estáticos que están en la carpeta public/
app.use(express.static('public'));

// Servir las imagenes que vienen de seedear la data
app.use('/imagenes', express.static('public/imagenes_seed'));

app.use(passport.initialize());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/posts', [postsRouter, comentariosRouter, likesRouter]);
app.use('/api/amistades', amistadesRouter);

app.use(errorHandler.procesarErroresDeDB);
app.use(errorHandler.procesarErroresDeTamañoDeBody);
if (config.ambiente === 'prod') {
  app.use(errorHandler.erroresEnProducción);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

let server;

if (process.env.NODE_ENV === 'development') {
  server = app.listen(config.puerto, () => {
    logger.info(`Escuchando en el puerto ${config.puerto}.`);
  });
} else {
  app.listen();
}

module.exports = {
  app,
  server
};
