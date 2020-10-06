function authZ(requiredRole){
    debugger
    if(!requiredRole){
        return true;
    }else{
        throw "403"
    }
}


module.exports = {
    authZ: authZ
};