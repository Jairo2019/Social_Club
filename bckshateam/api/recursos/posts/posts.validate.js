const Joi = require('@hapi/joi');
const fileType = require('file-type');
const log = require('../../../utils/logger');

const blueprintDePost = Joi.object().keys({
  url: Joi.string().required(),
  caption: Joi.string().max(180)
});

function validarMetadataDePost(req, res, next) {
  let resultado = Joi.validate(req.body, blueprintDePost, {
    abortEarly: false,
    convert: false
  });
  if (resultado.error === null) {
    next();
  } else {
    let erroresDeValidacion = resultado.error.details.reduce(
      (acumulador, error) => {
        return acumulador + `[${error.message}]`;
      },
      ''
    );

    log.warn(
      'El siguiente post no pasó la validación: ',
      req.body,
      erroresDeValidacion
    );
    res
      .status(400)
      .send(
        `El post en el body debe especificar url. Errores en tu request: ${erroresDeValidacion}`
      );
  }
}

const MIME_TYPE_VALIDOS = ['image/jpeg', 'image/jpg', 'image/png'];
function validarImagen(req, res, next) {
  let contentType = req.get('content-type');
  if (!MIME_TYPE_VALIDOS.includes(contentType)) {
    log.warn(
      `Request para subir imagen no tiene content-type valido [${contentType}]`
    );
    res
      .status(400)
      .send(
        `Archivos de tipo ${contentType} no son soportados. Usar uno de ${MIME_TYPE_VALIDOS.join(
          ', '
        )}`
      );
    return;
  }

  let fileInfo = fileType(req.body);
  if (!MIME_TYPE_VALIDOS.includes(fileInfo.mime)) {
    const mensaje = `Disparidad entre content-type [${contentType}] y tipo de archivo [${fileInfo.ext}]. Request no será procesado`;
    log.warn(`${mensaje}.`);
    res.status(400).send(mensaje);
    return;
  }

  // Agregar la extensión al request para que la podamos usar al guardar la imagen
  req.extensionDeArchivo = fileInfo.ext;
  next();
}

module.exports = {
  validarMetadataDePost,
  validarImagen
};
