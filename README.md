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

docker build -t flask-repo .
docker tag flask-repo:latest 509399624827.dkr.ecr.eu-north-1.amazonaws.com/flask-repo:latest

aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 509399624827.dkr.ecr.eu-north-1.amazonaws.com

docker push 509399624827.dkr.ecr.eu-north-1.amazonaws.com/flask-repo:latest

aws ecs update-service --cluster cluster --service flask-service --force-new-deployment > app/resources/sample_update_service.json