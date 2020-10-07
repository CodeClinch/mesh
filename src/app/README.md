# Skeleton project for Swagger

# Scripts
## Create and publish docker image 
```
docker build -t codeclinch/mesh .
docker run -d -p 10010:10010 codeclinch/app:latest 
docker login -u <usr> -p <pwd>
docker push codeclinch/mesh:latest
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