const axios = require('axios');
const atob = require('atob');

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

async function authZ(req, authOrSecDef, scopesOrApiKey, callback) {
  console.log("--- secure call ---");
  var current_req_scopes = req.swagger.operation["x-security-scopes"];
  let r = null;
  try{
    let jwt = {};
    if(req.headers && req.headers.authorization){
      jwt = parseJwt(req.headers.authorization);
      console.log(`Secure headers: ${JSON.stringify(jwt)}`);
    }else{
      jwt.user_uuid = "";
      console.log(`No authorization headers`);
    }
    debugger
    let url = `http://localhost:8181/v1/data/cas/allow`;    
    let opaParameters = {
      method: 'post',
      url: url,
      headers: {}, 
      data: {
        "input": {
          "$dcl": {
              "user2policy": [
                "zone-default",
                jwt.user_uuid
              ],
              "action": current_req_scopes[0]
          }
        }
      }
    };

    console.log(`OPA call: ${JSON.stringify(opaParameters)}`);
    r = await axios(opaParameters);
    console.log(`OPA result: ${JSON.stringify(r.data)}`);
    
  }catch(err){
    console.error(JSON.stringify(err));
    err['statusCode'] = 401; // custom error code
    return callback(err);    
  }
  
  if(r && r.data && r.data.result && r.data.result === true){
    return callback();
  }else{
    var err = new Error('Failed to authorisation using bearer token');
    err['statusCode'] = 401; // custom error code
    return callback(err);
  }
}

module.exports = {
    authZ: authZ
};