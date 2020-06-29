// Rutas de la Entidad de Seguridad
const express = require('express');
let router = express.Router();
const model = require('./sec.model');

const init = async ()=>{
    await model.initModel();
}
init();
router.post('/login', async (req, res)=>{
    return res.status(403).json({ "msg": "Ruta No Implementada" });
});// post /login
router.post('/signin', async (req, res)=>{
  try {
    let {email, pswd, image, edad, nombre_usuario, sexo} = req.body;
    const rslt = await model.addOne(email, pswd, image, edad, nombre_usuario, sexo);
    res.status(200).json(rslt);
  } catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
});// post /signin

module.exports = router;