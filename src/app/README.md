# Skeleton project for Swagger

# Scripts
## Create and publish docker image 
```
docker build -t codeclinch/mesh .
docker run -d -p 10010:10010 codeclinch/mesh:latest 
docker login -u <usr> -p <pwd>
docker push codeclinch/mesh:latest
kubectl delete -f deployment-ui.yaml -n ui --context east
kubectl apply -f deployment-ui.yaml -n ui --context east
``` 
## Create and publish docker image 
```
docker build -t codeclinch/ui .
docker run -d -p 3000:3000 codeclinch/ui:latest 
docker push codeclinch/ui:latest
``` 

## Cas docker
``` 
docker build -t codeclinch/opa .
docker run -d -p 8181:8181 codeclinch/opa:latest 
docker push codeclinch/opa:latest

docker build -t codeclinch/opa2 .
docker run -d -p 8181:8181 codeclinch/opa2:latest
docker push codeclinch/opa2:latest
``` 

## Create Kubernetes deployment
kubectl apply -f deployment.yaml --context east
kubectl get service -n istio-system --context east
kubectl get pods -n client --context east
kubectl logs demomesh-5f875798b4-z4kcr -n client --context east -c demomesh

kubectl exec --context=east -n client demomesh-5f875798b4-9cz24 -c demomesh -it sh

curl -s -I -H "Host:demomesh.example.com" "http://a5f52e5a330724abdb9c7c185183376a-1500666398.eu-central-1.elb.amazonaws.com/demo/healthcheck"

curl -s -I -H "Host:demomesh.example.com" "http://demomesh:10010/healthcheck"


curl -H "Host:demomesh.example.com" "http://demomesh:10010/ping"  


## Certs
https://istio.io/latest/docs/tasks/traffic-management/ingress/secure-ingress/


openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example.com.key -out example.com.crt

openssl req -out demomesh.example.com.csr -newkey rsa:2048 -nodes -keyout demomesh.example.com.key -subj "/CN=demomesh.example.com/O=demomesh organization"

openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 0 -in demomesh.example.com.csr -out demomesh.example.com.crt

kubectl create -n istio-system secret tls demomesh-credential --key=demomesh.example.com.key --cert=demomesh.example.com.crt --context east


## Next step 
https://istio.io/latest/blog/2019/app-identity-and-access-adapter/
https://medium.com/@suman_ganta/openid-authentication-with-istio-a32838adb492


