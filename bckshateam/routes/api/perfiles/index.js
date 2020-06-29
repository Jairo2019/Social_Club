//Rutas de la entidad Perfiles
const express = require('express');
let router = express.Router();
const model = require('./perfiles.model');

const init = async ()=>{
    await model.initModel();
}
init();

router.get('/', async (req, res)=>{
  try {
    let perfiles = await model.getAll();
    res.status(200).json(perfiles);
  } catch (err) {
    console.log(err);
    res.status(500).json({"Error":"Algo Sucedio Mal intentar de nuevo."});
  }
}); // get /

router.get('/one/:id', async (req, res)=>{
  try{
      let {id} = req.params;
      let cuenta = await model.getOne(id);
      res.status(200).json(cuenta);
  }catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
}); //get one

router.get('/nombre_usuario/:nombre_usuario', async (req, res) => {
  try {
    let { nombre_usuario } = req.params;
    let rnombre_usuario = await model.getByCuenta(nombre_usuario);
    res.status(200).json(rnombre_usuario);
  } catch (err) {
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
}); //get one

router.put('/support/:id', async (req, res)=>{
  try{
    let { id } = req.params;
    const rlst = await model.like(id);
    res.status(200).json(rlst);
  }catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
});//put/support

module.exports = router;
