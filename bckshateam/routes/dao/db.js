let mongoClient = require('mongodb').MongoClient;

let _db;

// Singleton --> 
module.exports = class {
  static async getDB(){
    if(_db){
      return _db;
    } else {
      try {
        let client = await mongoClient.connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true });
        _db = client.db(process.env.MONGODBDBNAME);
        return _db;
      }catch(e){
        console.log(e);
        process.exit(1);
      }
    }
  }
}
