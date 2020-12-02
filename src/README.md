# Skeleton project for Swagger

# Scripts
## Common
docker login -u <usr> -p <pwd>

## Run app 
```
docker run -d -p 10010:10010 codeclinch/mesh:latest 

``` 
## Run UI
```
docker run -d -p 3000:3000 codeclinch/ui:latest 
``` 

## Run OPA/CAS
``` 
docker run -d -p 8181:8181 codeclinch/opa:latest
``` 
#### Test with curl
```
curl --location --request POST 'http://localhost:8181/v1/data/cas/allow' \
--header 'Content-Type: application/json' \
--data-raw '{
    "input": {
        "$dcl": {
            "user2policy": [
            "zone-default",
            "e57b4fef-65de-44e3-9679-bf04c9441d6e",
            "Employee"
            ]
        }
    }
}'
```
#### Test im browser
Get data.json im browser.
```
http://localhost:8181/v1/data
```

## Next step 
https://istio.io/latest/blog/2019/app-identity-and-access-adapter/
https://medium.com/@suman_ganta/openid-authentication-with-istio-a32838adb492


