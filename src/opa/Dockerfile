FROM openpolicyagent/opa:0.26.0-istio

# Create app directory
WORKDIR .

ADD ./application/target/classes/cas /policies
# ADD ./application/target/classes/cas/test.rego /policies/test
# ADD ./application/target/classes/cas/policy.rego /policies/envoy
# ADD ./application/target/classes/cas/web.rego /policies/cas

EXPOSE 8181
CMD [ "run", "--server", "--log-format=json-pretty", "--log-level=debug", "--set=decision_logs.console=true", "/policies" ]