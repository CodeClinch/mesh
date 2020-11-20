const YAML = require('yamljs');
const yamlwriter = require('js-yaml');

var fs = require('fs');
const homedir = require('os').homedir();
console.log("-- Start --")
let name = process.argv[2];
if (name == "0"){
    name = "";
}
console.log(`Selected files: kubeconfig--sectest--west/east${name}.yaml`)

if (process.argv.length > 2){
    try {
        var westjaml = fs.readFileSync(`${homedir}/Downloads/kubeconfig--sectest--west${name}.yaml`, 'utf8');
        var eastjaml = fs.readFileSync(`${homedir}/Downloads/kubeconfig--sectest--east${name}.yaml`, 'utf8');
        var westjson = nativeObject = YAML.parse(westjaml);
        var eastjson = nativeObject = YAML.parse(eastjaml);

        var configyaml = fs.readFileSync(`config`, 'utf8');
        var config = nativeObject = YAML.parse(configyaml);

        for(let i = 0; i < config.clusters.length; i++){
            if(config.clusters[i].name == "west"){
                console.log("---west")
                config.clusters[i].cluster.server = westjson.clusters[0].cluster.server;
                config.clusters[i].cluster["certificate-authority-data"] = westjson.clusters[0].cluster["certificate-authority-data"];
            }else if(config.clusters[i].name == "east"){
                config.clusters[i].cluster.server = eastjson.clusters[0].cluster.server;
                config.clusters[i].cluster["certificate-authority-data"] = eastjson.clusters[0].cluster["certificate-authority-data"];
            }
        }

        for(let i = 0; i < config.users.length; i++){   
            if(config.users[i].name.indexOf("west") > -1){
                config.users[i].user.token = westjson.users[0].user.token;
            }else if (config.users[i].name.indexOf("east") > -1){
                config.users[i].user.token = eastjson.users[0].user.token;
            }
        }

        let yamlconfigString = yamlwriter.safeDump(config);
        fs.writeFileSync(`${homedir}/.kube/config`, yamlconfigString);

        //console.log(yamlconfigString);
    } catch(e) {
        console.log('Error:', e.stack);
    }    
}else{
    console.log("Error: please specify file pattern")
}




