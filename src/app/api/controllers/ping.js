'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
const moment = require("moment");
var log = require('../helpers/log.js');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  ping: ping, 
  secureping : secureping
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

var pings = [];

function secureping(req, res) {
  log.info("Call secureping")
  return pinghelper(req, res);
}

function ping(req, res) {
  log.info("Call ping")
  return pinghelper(req, res);
}

function pinghelper(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  pings.push( {
    time: moment().format("hh:mm:ss:ms"),
    message: `ping ${pings.length+1}`,
    requestHeaders : req.headers
  } );

  // this sends back a JSON response which is a single string
  res.json(pings);
}
