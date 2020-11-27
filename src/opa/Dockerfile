FROM openpolicyagent/opa:latest

# Create app directory
WORKDIR .

ADD ./application/target/dcl_opa /var/etc/policies
ADD ./application/target/classes/cas/data.json /var/etc/policies

EXPOSE 8181
CMD [ "run", "--server", "--log-format=json-pretty", "--log-level=debug", "--set=decision_logs.console=true", "/var/etc/policies/data.json", "/var/etc/policies/cas"  ]