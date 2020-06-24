// Rutas de la Entidad de Publicaciones
const express = require('express');
let router = express.Router();


const init = async ()=>{
    await model.initModel();
}
//init();

router.get('/', async (req, res)=>{
  try {
    let publicaciones = await model.getAll();
    res.status(200).json(publicaciones);
  } catch (err) {
    console.log(err);
    res.status(500).json({"Error":"Algo Sucedio Mal intentar de nuevo."});
  }
}); // get /

router.get('/one/:id', async (req, res)=>{
  res.status(403).json({"msg":"No Implementado"})
}); //get one

router.post('/new', async (req, res)=>{
  res.status(403).json({"msg":"No Implementado"})
});// post /new

module.exports = router;
