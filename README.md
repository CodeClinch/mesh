# mesh
## Setup System 
cd scripts
node index.js 3
cd ~/workspace/github.sap/"CP Security"/Knowledge-Base/80_Kubernetes/demo
source service-mesh-demo-setup.sh
./service-mesh-istio-setup.sh

## Demo apps setup
cd ~/workspace/github.com/CodeClinch/mesh/src

## Update deployment
kubectl get services -n istio-system --context west
Update file deployment-client.yaml

## Install demo
kubectl apply -f deployment-ui-namespace.yaml --context east -n ui
kubectl apply -f deployment-ui.yaml --context east -n ui
kubectl apply -f deployment-server.yaml --context west -n server
kubectl apply -f deployment-client.yaml --context east -n client

## Execute demo
kubectl get services -n istio-system --context east
export ingresseast=ad2452a1cec7441a28d012798c8ac20f-1121056386.eu-central-1.elb.amazonaws.com
### Deny
kubectl apply -f AuthZPolicy.yaml --context west -n server
### Allow
kubectl apply -f AuthZPolicyAllowUI.yaml --context west -n server
### JWT
kubectl apply -f userauth.yaml --context west -n server

export password=asdf
curl --location --request POST 'https://aybzbjlhs.accounts400.ondemand.com/oauth2/token?grant_type=password' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic YzEzZjgyZTQtMzEzMi00Y2M2LWEyMDMtZWMwOTRlNDEyMWU5Ok1RPXlzZzB3NkQ/NT1Id3o/Qk11S3Z1akl4YnBiZ0txUDVD' \
--data-urlencode 'username=christian.lahmer@sap.com' \
--data-urlencode 'password='$password

export bearer=asdf

curl --location --request GET $ingresseast '?dest=secure/ping&demomeshhost=demomesh.server.global&action=serverpol'\
--header 'Authorization: Bearer '$bearer \
--data-raw ''

## Reset demo

