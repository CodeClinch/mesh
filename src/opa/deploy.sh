cd application
mvn clean install
cd ..
docker build -t codeclinch/opa .
docker push codeclinch/opa:latest