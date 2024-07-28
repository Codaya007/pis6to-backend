# Aquí autenticar con token si es necesario
# API gateway
docker build -t api-gateway:3.0 ./api-gateway/
docker tag api-gateway:3.0 pis6toregistrygroup.azurecr.io/api-gateway:3.0
docker push pis6toregistrygroup.azurecr.io/api-gateway:3.0

kubectl apply -f ./api-gateway/k8s/deployment.yaml
kubectl apply -f ./api-gateway/k8s/service.yaml

# authentication-module
docker build -t authentication:3.0 ./authentication-module/
docker tag authentication:3.0 pis6toregistrygroup.azurecr.io/authentication:3.0
docker push pis6toregistrygroup.azurecr.io/authentication:3.0

kubectl apply -f ./authentication-module/k8s/deployment.yaml
kubectl apply -f ./authentication-module/k8s/service.yaml

# alerts-and-notifications-module
docker build -t alertsandnotifications:3.0 ./alerts-and-notifications-module/
docker tag alertsandnotifications:3.0 pis6toregistrygroup.azurecr.io/alertsandnotifications:3.0
docker push pis6toregistrygroup.azurecr.io/alertsandnotifications:3.0

kubectl apply -f ./alerts-and-notifications-module/k8s/deployment.yaml
kubectl apply -f ./alerts-and-notifications-module/k8s/service.yaml

# climate-data-module
docker build -t climatedata:3.0 ./climate-data-module/
docker tag climatedata:3.0 pis6toregistrygroup.azurecr.io/climatedata:3.0
docker push pis6toregistrygroup.azurecr.io/climatedata:3.0

kubectl apply -f ./climate-data-module/k8s/deployment.yaml
kubectl apply -f ./climate-data-module/k8s/service.yaml

# download-requests-module
docker build -t downloadrequests:3.0 ./download-requests-module/
docker tag downloadrequests:3.0 pis6toregistrygroup.azurecr.io/downloadrequests:3.0
docker push pis6toregistrygroup.azurecr.io/downloadrequests:3.0

kubectl apply -f ./download-requests-module/k8s/deployment.yaml
kubectl apply -f ./download-requests-module/k8s/service.yaml

# media-module
docker build -t media:3.0 ./media-module/
docker tag media:3.0 pis6toregistrygroup.azurecr.io/media:3.0
docker push pis6toregistrygroup.azurecr.io/media:3.0

kubectl apply -f ./media-module/k8s/deployment.yaml
kubectl apply -f ./media-module/k8s/service.yaml

# monitoring-stations-module
docker build -t monitoringstations:3.0 ./monitoring-stations-module/
docker tag monitoringstations:3.0 pis6toregistrygroup.azurecr.io/monitoringstations:3.0
docker push pis6toregistrygroup.azurecr.io/monitoringstations:3.0

kubectl apply -f ./monitoring-stations-module/k8s/deployment.yaml
kubectl apply -f ./monitoring-stations-module/k8s/service.yaml

# system-activities-module
docker build -t systemactivities:3.0 ./system-activities-module/
docker tag systemactivities:3.0 pis6toregistrygroup.azurecr.io/systemactivities:3.0
docker push pis6toregistrygroup.azurecr.io/systemactivities:3.0

kubectl apply -f ./system-activities-module/k8s/deployment.yaml
kubectl apply -f ./system-activities-module/k8s/service.yaml

kubectl apply -f ./k8s/ingress.yml
