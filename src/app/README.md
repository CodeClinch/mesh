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
