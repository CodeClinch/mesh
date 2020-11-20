kubectl apply -n server -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingressgateway # use Istio default gateway implementation
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.example.com"
EOF

kubectl apply -n server -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
  - "httpbin.example.com"
  gateways:
  - httpbin-gateway
  http:
  - match:
    - uri:
        prefix: /status
    - uri:
        prefix: /delay
    route:
    - destination:
        port:
          number: 8000
        host: httpbin
EOF

## call server directly
kubectl get svc istio-ingressgateway -n istio-system
curl -s -I -HHost:httpbin.example.com "ae7bc7f57a8894729bf1cdc289026df6-911806018.eu-central-1.elb.amazonaws.com/status/200"

kubectl get pods -n client --context=east 
kubectl exec --context=east sleep-5588dcbb8d-4qqz9 -n client -c sleep -it sh

curl -I "http://httpbin.server.global:8000/headers"

kubectl --context west -n server logs -l app=httpbin -c istio-proxy --tail=1

## Get url from server 
kubectl --context=west get svc --selector=app=istio-ingressgateway -n istio-system -o jsonpath='{.items..status.loadBalancer.ingress..hostname}')