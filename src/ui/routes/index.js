var express = require('express');
var router = express.Router();
const axios = require('axios');
const log = require("../log.js");
const atob = require('atob');
const libs = require("./libs.js")
const parseJwt = libs.parseJwt;
const opaurl = `http://demoopa.server.global:8181/v1/data/user2policy`;

/* GET home page. */
router.get('/', function(req, res, next) {
  callBackend(req, res, next);
});

async function callBackend(req, res, next){
  let msg = null;
  let url = "";
  let jwt = {};
  try{
    if(req.query.dest && req.query.demomeshhost){
      url = `http://${req.query.demomeshhost}:10010/${req.query.dest}`;
      log.info(`Call remote server. Target: ${url}`);
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
      log.info(`- Parameter for server call: ${JSON.stringify(config)}`);
      let r = await axios.get(url, config);
      log.info(`- Success full call, response: ${r.status}`);
      log.debug(`- Success full call, response data: ${JSON.stringify(r.data)}`);
      msg = {
        status : 200,
        text : "Success",
        target : url
      }
    }else{
      log.info(`- Local request only (no target server specified. Query: ${req.query.dest})`)
    }
  }catch(err){
    debugger
    log.error(`- Server call failed: . ${err.toString()}`)
    let status = "403";
    
    if(err && err.response && err.response.headers){
      status = err.response.headers.status;
      log.error(`-- Response headers from failed call: ${JSON.stringify(err.response.headers)}`)
    }else{
      log.error("-- No http header response")
    }
    msg = {
      status : status,
      text : err.message,
      target : url
    }
  }  

  res.render('index', { 
    title: 'Mesh Test', 
    message : msg, 
    jwt : jwt,
    query : req.query });
}

router.post('/', async function(req, res, next) {
  let jwt = {};
  let status = "200"
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
      status = "500";
    }

  }else{
    status = "500";
    log.error("No JWT token found")
  }

  msg = {
    status : status,
    text : `Roles assigned to user ${jwt.mail}`,
    target : opaurl
  }

  res.render('index', { 
    title: 'Mesh Test', 
    message : msg, 
    query : req.query });

});

module.exports = router;
