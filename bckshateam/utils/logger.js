const winston = require('winston');
const config = require('../config');

/*
  Transportes disponibles: https://github.com/winstonjs/winston/blob/master/docs/transports.md
  
  Niveles de Logs:
  error: 0
  warn: 1 
  info: 2 
  verbose: 3
  debug: 4
  silly: 5 
*/

module.exports = new winston.Logger({
  transports: [
    // new winston.transports.File({
    //   level: 'info',
    //   json: false,
    //   handleExceptions: true,
    //   maxsize: 100, // 5 MB
    //   maxFiles: 5,
    //   filename: `${__dirname}/../logs/logs-de-aplicacion.log`,
    //   prettyPrint: object => { return JSON.stringify(object) }
    // }),
    new winston.transports.Console({
      level: config.suprimirLogs ? 'error' : 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: object => {
        return JSON.stringify(object);
      }
    })
  ]
});
