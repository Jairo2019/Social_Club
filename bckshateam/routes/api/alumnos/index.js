const express = require('express');
let router = express.Router();
const model = require('./cuentas.model');

const init = async ()=>{
    await model.initModel();
}
init();

router.get('/', async (req, res)=>{
  try {
    let alumnos = await model.getAll();
    res.status(200).json(alumnos);
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

router.get('/cuenta/:cuenta', async (req, res) => {
  try {
    let { cuenta } = req.params;
    let rcuenta = await model.getByCuenta(cuenta);
    res.status(200).json(rcuenta);
  } catch (err) {
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
}); //get one

router.post('/new', async (req, res)=>{
  try {
    let {cuenta, nombre } = req.body;
    const rslt = await model.addOne(cuenta, nombre);
    res.status(200).json(rslt);
  } catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
});// post /new

module.exports = router;
