FROM openpolicyagent/opa:latest

# Create app directory
WORKDIR .

ADD ./application/target/classes/cas /var/etc/policies

EXPOSE 8181
CMD [ "run", "--server", "--log-format=json-pretty", "--log-level=debug", "--set=decision_logs.console=true", "/var/etc/policies"  ]