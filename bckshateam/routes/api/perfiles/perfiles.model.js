// Primero obtenemos la clase de la base de datos. (Singleton)
const db = require('../../dao/db');
const ObjectId = require('mongodb').ObjectId;

// Definimos Variables que contendran punteros hacia las colecciones
let perfilesColl; // VB Variable Globales | Cloujure
//let notasColl;

// NOTA: LOS MODELOS DE DATOS SON CLASES QUE CONTIENEN SOLAMENTE METODOS ESTÁTICOS
module.exports = class {
  // initModel 
  static async initModel(){
    if(!perfilesColl) {
      let _db = await db.getDB();
      //console.log(_db);
      perfilesColl = await _db.collection("perfiles");
      console.log("Coleccion de Perfiles asignados");
      return;
    }else{
      return;
    }
  }

  static async getAll(){
    try{
      if(perfilesColl){
        let registro = await perfilesColl.find();
        return registro.toArray();
      }
      return [];
    } catch(err){
      console.log(err);
      return err;
    }
  }

  static async addOne(email, pswd, image, edad, nombre_usuario, sexo) {
    try{
      const newPerfil = {email:email, pswd:pswd, image:image, edad:edad, nombre_usuario:nombre_usuario, sexo: sexo};
      const result = await perfilesColl.insertOne(newPerfil);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  }
  static async getOne(id) {
    try {
      let filter = { "_id": new ObjectId(id)};
      const result = await perfilesColl.findOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async getByNombre(nombre_usuario) {
    try {
      let filter = { "nombre_usuario": nombre_usuario};
      const result = await perfilesColl.findOne(filter);
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async support(id) {
    try {
      let filter = {"_id": new ObjectId(id)};
      let update = {"$inc":{"like":1}, "$set":{"last_modified": new Date().getTime()}};
      const result = await perfilesColl.updateOne(filter,update);
      return result;
    }catch(err){
      console.log(err);
      return err;
    }
  }
} //class
