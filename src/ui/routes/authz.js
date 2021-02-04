var express = require('express');
var router = express.Router();
const log = require("../log.js");
const axios = require('axios');
const libs = require("./libs.js");
const parseJwt = libs.parseJwt;
//const opaurl = "http://localhost:8181/v1/data/user2policy";
const opaurl = `http://demoopa.server.global:8181/v1/data/user2policy`;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let jwt = {}

  let config = {
    headers: {}
  }

  if(req.headers.authorization){
    config.headers.Authorization = req.headers.authorization
    jwt = parseJwt(req.headers.authorization);
    log.info(`- With JWT forwarding: ${JSON.stringify(jwt)}`)
  }else{
    log.info("- Without JWT forwarding: no authentication headers provided")
  }

  let r = {}
  try{
    r = await axios.get(opaurl, config);
    log.info(`Response from OPA get: ${JSON.stringify(r.data)} `)
  }catch(e){
    log.error(`Connection to opa failed: ${e.toString()}, url: ${opaurl}`)
  }

  res.render('authz', { 
    title: 'AuthZ', 
    opa : r,
    jwt : jwt,
    query : req.query });
});


router.post('/', async function(req, res, next) {
  let jwt = {};
  let userdata = {
    id : "",
    roles : []
  }
  if(req.headers && req.headers.authorization){
    let config = {
      headers: {}
    }

    config.headers.Authorization = req.headers.authorization
    jwt = parseJwt(req.headers.authorization);
    log.info(`- With JWT forwarding: ${JSON.stringify(jwt)}`)
  
    let r = {}
    try{
      r = await axios.get(opaurl, config);
      log.info(`Response from OPA get: ${JSON.stringify(r.data)}`)
    }catch(e){
      log.error(e.toString())
    }
    
    userdata.id = jwt.user_uuid;
    userdata.roles = [
      "cas.Everyone",
      "cas.Employee",
      "cas.Test"
    ];
    r.data.result["zone-default"][userdata.id] = userdata.roles;

    try{
      config.data = r.data.result;
      config.url = opaurl;
      config.method = 'put';
      r = await axios(config);
      log.info(`Response from OPA put: ${JSON.stringify(r.data)}`)
    }catch(e){
      log.error(e.toString())
    }

  }else{
    log.error("No JWT token found")
  }

  res.render('authzresp', { 
    title: 'AuthZ', 
    jwt : jwt,
    userdata : userdata,
    query : req.query });
});


module.exports = router;
