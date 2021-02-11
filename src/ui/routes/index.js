var express = require('express');
var router = express.Router();
const axios = require('axios');
const log = require("../log.js");
const atob = require('atob');
const libs = require("./libs.js")
const parseJwt = libs.parseJwt;

/* GET home page. */
router.get('/services', function(req, res, next) {
  getServices(req, res, next, "");
});

async function getServices(req, res, next, msg){
  log.info(`Start getServices`)
  try{
    const k8s = require('@kubernetes/client-node');
    log.info(`After include kube api`);

    const kc = new k8s.KubeConfig();
    log.info(`After get kube config`)
    
    kc.loadFromDefault();
    log.info(`After loadFromDefault`)
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    log.info(`After makeApiClient`)
    
    let r = {};
    let ns = req.query && req.query.ns ? req.query.ns : false;
    log.info(`Selected ns ${ns}`)

    if(!ns){
      r.pods = await (await k8sApi.listPodForAllNamespaces()).body.items;
      log.info(`After listNamespacedPod`)
      r.services = await (await k8sApi.listServiceForAllNamespaces()).body.items;
      log.info(`After listNamespacedService`)
    }else{
      r.pods = await (await k8sApi.listNamespacedPod(ns)).body.items;
      log.info(`After listNamespacedPod for ns ${ns}`)
      r.services = await (await k8sApi.listNamespacedService(ns)).body.items;
      log.info(`After listNamespacedService for ns ${ns}`)  
    }

    let srv = [];
    let skip = ["kube-system", "istio-system"]
    for(let i = 0; i < r.services.length; i++){
      if(skip.indexOf(r.services[i].metadata.namespace) >= 0){
        continue;
      }
      srv.push({
        namespace : r.services[i].metadata.namespace,
        name : r.services[i].metadata.name
      })
    }

    //demoopa.client
    const opaurl = `http://${(process.env.opalocal ? process.env.opalocal : "localhost")}:8181/v1/data/service2service`;  
    log.info(`OPA url: ${opaurl}`)
    let config = {
      headers: {}
    }
    let mappings = []
    try{
      r = await axios.get(opaurl, config);
      log.info(`Response from OPA get: ${JSON.stringify(r.data)}`)
      mappings = r.data.result;
    }catch(e){
      log.error("Failer loading OPA data")
    }
  

    res.render('services', { 
      title: 'Service Policies', 
      query : req.query, 
      mappings : mappings,
      msg : msg,
      srv : srv });
    //res.send(srv);
}catch(e){
  log.error(`Error when calling Kubernetes API ${e.message}, Stringify ${JSON.stringify(e)}`)
  res.render('error', { 
    message : `Error when calling Kubernetes API`, 
    error : e });
  }
}
router.post('/services', function(req, res, next) {
  savePolicy(req, res, next);
});

async function savePolicy(req, res, next){
  const opaurl = `http://${(process.env.opalocal ? process.env.opalocal : "localhost")}:8181/v1/data/service2service`;
  log.info(`OPA url: ${opaurl} env: ${process.env.opalocal}`)

  let source = req.body.source;
  let target = req.body.target;
  let zone = req.body.zone;
  let action = req.body.action;

  let config = {
    headers: {}
  }
  let r = {}
  try{
    r = await axios.get(opaurl, config);
    log.info(`Response from OPA get: ${JSON.stringify(r.data)}`)

    if(!r.data.result[zone] && zone){
      r.data.result[zone] = {};
    }
    if(target && zone && !r.data.result[zone][target]){
      r.data.result[zone][target] = [];
    }
    
    if(action == "add"){
      r.data.result[zone][target].push(source);
    } else if(action == "del"){
      let keys = Object.keys(r.data.result);
      for(let i = 0; i < keys.length; i++){
        r.data.result[keys[i]] = {};
      }
    }
    
    try{
      config.data = r.data.result;
      config.url = opaurl;
      config.method = 'put';
      r = await axios(config);
      log.info(`Response from OPA put: ${JSON.stringify(r.data)}`)
    }catch(e){
      log.error("Failed to read from OPA" + e.toString())
      status = "500";
    }    
  }catch(e){
    log.error("Failed to read from OPA" + e.toString())
  }

  getServices(req, res, next, "Saved");
}

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
  const opaurl = `http://demoopa.server.global:8181/v1/data/principal2policies`;
  //const opaurl = `http://localhost:8181/v1/data/principal2policies`;
  
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
    r.data.result[zone][userdata.id] = userdata.roles;

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
