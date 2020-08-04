function validarId(req, res, next) {
  let id = req.params.id
  // regex = regular expressions
  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send(`El id [${id}] suministrado en el URL no es válido`)
    return
  }
  next()
}

module.exports = {
  validarId
}