// Rutas de la Entidad de Publicaciones
const express = require('express');
let router = express.Router();
const model = require('./publicaciones.model');

const init = async ()=>{
    await model.initModel();
}
init();

router.get('/all', async (req, res)=>{
  try {
    let publicaciones = await model.getAll();
    res.status(200).json(publicaciones);
  } catch (err) {
    console.log(err);
    res.status(500).json({"Error":"Algo Sucedio Mal intentar de nuevo."});
  }
}); // get /

router.get('/one/:id', async (req, res)=>{
  try{
      let {id} = req.params;
      let titulo= await model.getOne(id);
      res.status(200).json(titulo);
  }catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
}); //get one


router.post('/new', async (req, res)=>{
  try {
    let { titulo, descripcion, image, video } = req.body;
    const rslt = await model.addOne( titulo, descripcion, image, video);
    res.status(200).json(rslt);
  } catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
});// post /new

router.put('/support/:id', async (req, res)=>{
  res.status(403).json({"msg":"No Implementado"})
});//put/ support



router.delete ('/one/:id', async (req, res)=>{
  try {
      const {id} = req.params;
      const result = await model.deleteOne(id);
      res.status(200).json(result);
  }catch(err){
    console.log(err);
    res.status(500).json({ "Error": "Algo Sucedio Mal intentar de nuevo." });
  }
});


module.exports = router;

// router.post('/new', async (req, res)=>{
//   res.status(403).json({"msg":"No Implementado"})
// });// post /new

// module.exports = router;
