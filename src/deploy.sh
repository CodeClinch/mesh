echo --- Create APP image and upload to Dockerhub ---
cd app
./deploy.sh
cd ..
echo --- Create OPA image and upload to Dockerhub ---
cd opa
./deploy.sh
cd ..
echo --- Create UI image and upload to Dockerhub ---
cd ui
./deploy.sh
cd ..