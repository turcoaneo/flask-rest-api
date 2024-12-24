# flask-rest-api
Learning Flask and Docker on AWS Fargate with Vanilla JS, HTML, and CSS. Swagger also.

## install
venv\Scripts\activate
python -m pip install -r reqs.txt

## generate requirements.txt for Docker
python -m pipreqs.pipreqs . --force
### manually insert into requirements.txt
python-dotenv
gunicorn

## docker to be used
Docker desktop installed
docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest

## build app 
docker build -t flask-repo .

## deployment to AWS Fargate for app and mongodb as containers

docker tag flask-repo:latest 509399624827.dkr.ecr.eu-north-1.amazonaws.com/flask-repo:latest
docker tag mongodb/mongodb-community-server:latest 509399624827.dkr.ecr.eu-north-1.amazonaws.com/mongo-db:latest

aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 509399624827.dkr.ecr.eu-north-1.amazonaws.com

docker push 509399624827.dkr.ecr.eu-north-1.amazonaws.com/flask-repo:latest
docker push 509399624827.dkr.ecr.eu-north-1.amazonaws.com/mongo-db:latest

### force AWS tasks restart
aws ecs update-service --cluster cluster-flask-mongo --service service-recipe --force-new-deployment > app/resources/sample_update_service.json
aws ecs update-service --cluster cluster-flask-mongo --service service-recipe-db --force-new-deployment > app/resources/sample_update_service.json
