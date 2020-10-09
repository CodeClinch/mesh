const axios = require('axios');

async function authZ(req, authOrSecDef, scopesOrApiKey, callback) {
    var current_req_scopes = req.swagger.operation["x-security-scopes"];
    let r = null;
    try{
      let url = `http://localhost:8181/v1/data/cas/allow`;
      console.log(`OPA call: ${url}`);
      r = await axios.post(url, {
        "input": {
            "$cas": {
                "userId": "4b4804ef-9b3d-4772-bd47-8071c6f2a1b2",
                "action": current_req_scopes
            }
        }
    });
    debugger
    console.log(`OPA result: ${JSON.stringify(r.data)}`);
    
  }catch(err){
    console.error(JSON.stringify(err));
    res.status(500).send('Remote service could not be called');
  }
  var err = new Error('Failed to authorisation using bearer token');
  err['statusCode'] = 401; // custom error code
  return callback(err);
}

module.exports = {
    authZ: authZ
};