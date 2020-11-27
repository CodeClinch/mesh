kubectl --context=east label namespace ui istio-injection-
kubectl rollout restart deployment demoui --context east -n ui
kubectl get pods -n ui --context east

kubectl delete -f AuthZPolicyAllowUI.yaml -n server --context west
kubectl get AuthorizationPolicy -n server --context west
