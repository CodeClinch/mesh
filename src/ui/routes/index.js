var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  callBackend(req, res, next);
});

async function callBackend(req, res, next){
  let msg = null;
  let url = "";
  try{
    if(req.query.dest && req.query.demomeshhost){
      console.log(`--- Remote Call ---`);
      console.log(`Request headers: ${JSON.stringify(req.headers)}`);
      console.log(`--- End Headers ---`);
      let config = {
        headers: {}
      }
      if(req.headers.authorization){
        config.headers.Authorization = req.headers.authorization
      }
      url = `http://${req.query.demomeshhost}:10010/${req.query.dest}`;
      console.log(`UI calls server: ${url}`);
      console.log(`Parameter for server call: ${JSON.stringify(config)}`);
      let r = await axios.get(url, config);
      console.log(`Success full call, response: ${r.status}, ${r.data}`);
      msg = {
        status : 200,
        text : "Success",
        target : url
      }
    }
  }catch(err){
    console.error(JSON.stringify(err));
    let status = "";
    
    if(err && err.response && err.response.headers){
      status = err.response.headers.status;
      console.log(JSON.stringify(err.response.headers))
    }else{
      console.log("No http header response")
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
    query : req.query });
}

module.exports = router;
