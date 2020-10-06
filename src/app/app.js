'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

const swaggerUI = require("swagger-ui-express");



module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/healthcheck']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/healthcheck?name=Scott');
  }else{
    console.log('App is running on: curl http://127.0.0.1:' + port );
  }
});
