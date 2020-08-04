const mongoose = require('mongoose')
const log = require('../../utils/logger')

exports.procesarErrores = (fn) => {
  return function(req, res, next) {
    fn(req, res, next).catch(next)
  }
}

exports.procesarErroresDeDB = (err, req, res, next) => {
  if (err instanceof mongoose.Error || err.name === 'MongoError') {
    log.error('Ocurrió un error relacionado a mongoose.', err)
    err.message = "Error relacionado a la base de datos ocurrió inesperadamente. Para ayuda contacte a daniel@gmail.com"
    err.status = 500
  }
  next(err)
}

exports.procesarErroresDeTamañoDeBody = (err, req, res, next) => {
  if (err.status === 413) {
    log.error(`Request enviada a la ruta [${req.path}] excedió el límite de tamaño. Request no será procesado.`)
    err.message = `El body enviado en el request a la ruta [${req.path}] pasa el límite de tamaño. Máximo tamaño permitido es ${err.limit} bytes.`
  }
  next(err)
}

exports.erroresEnProducción = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    message: err.message
  })
}

exports.erroresEnDesarrollo = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    message: err.message,
    stack: err.stack || ''
  })
}