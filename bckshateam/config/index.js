const ambiente = process.env.NODE_ENV || 'development';

const configuraciónBase = {
  jwt: {},
  puerto: process.env.PORT,
  suprimirLogs: false,
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  s3BucketName: 'vende-tus-corotos-data',
  pathEnBucket: 'imagenes',
  guardarImagenesEnS3: false
};

let configuraciónDeAmbiente = {};

switch (ambiente) {
  case 'desarrollo':
  case 'dev':
  case 'development':
    configuraciónDeAmbiente = require('./dev');
    break;
  case 'producción':
  case 'production':
  case 'prod':
    configuraciónDeAmbiente = require('./prod');
    break;
  case 'test':
    configuraciónDeAmbiente = require('./test');
    break;
  default:
    configuraciónDeAmbiente = require('./dev');
}

module.exports = {
  ...configuraciónBase,
  ...configuraciónDeAmbiente
};
