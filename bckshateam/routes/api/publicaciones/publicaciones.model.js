// Primero obtenemos la clase de la base de datos. (Singleton)
const db = require('../../dao/db');
const ObjectId = require('mongodb').ObjectId;

// Definimos Variables que contendran punteros hacia las colecciones
let publicacionColl; // VB Variable Globales | Cloujure
//let notasColl;

// NOTA: LOS MODELOS DE DATOS SON CLASES QUE CONTIENEN SOLAMENTE METODOS ESTÁTICOS
module.exports = class {
  // initModel 
  static async initModel(){
    if(!publicacionColl) {
      let _db = await db.getDB();
      //console.log(_db);
      publicacionColl = await _db.collection('publicaciones');
      console.log("Coleccion de Publicaciones asignados");
      return;
    }else{
      return;
    }
  }

  static async getAll(){
    try{
      if(publicacionColl){
        let registro = await publicacionColl.find();
        return registro.toArray();
      }
      return [];
    } catch(err){
      console.log(err);
      return err;
    }
  }

  static async addOne( titulo, descripcion, image, video) {
    try{
      const newPublicacion = {titulo:titulo, descripcion:descripcion, image:image, video:video};
      const result = await publicacionColl.insertOne(newPublicacion);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  }

  static async getOne(id) {
    try {
      let filter = { "_id": new ObjectId(id)};
      const result = await publicacionColl.findOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getByCuenta(titulo) {
    try {
      let filter = { "titulo": titulo };
      const result = await publicacionColl.findOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  } //get by titulo
  static async support(id,titulo, descripcion, image, video) {
    try {
      let filter = {"_id": new ObjectId(id)};
      let update = { "$set":{"titulo":titulo, "descripcion":descripcion, "image":image, "video":video}};
      const result = await publicacionColl.updateOne(filter,update);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  }//update publicacion


  static async deleteOne(id){
    try{
      let filter = {"_id": new ObjectId(id)};
      const result = await publicacionColl.deleteOne(filter);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  }


} //class
