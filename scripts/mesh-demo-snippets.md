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
curl -s -I -HHost:httpbin.example.com "a217815781811403a8ae1dbb341d42e5-707072058.eu-central-1.elb.amazonaws.com/status/200"

kubectl exec --context=shoot--sectest--east2 sleep-64764b4c5c-vdtd7 -n client -c sleep -it sh

curl -sI httpbin.server.global:8000/headers

-- curl -sI httpbin.${DEMO_SERVER_NAMESPACE}.global:8000/headers