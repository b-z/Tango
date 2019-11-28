build:
	npm install

run:
	docker build -t tango-nodejs . \
	&& kubectl rollout restart deployment tango-nodejs-deployment \
	&& minikube service tango-nodejs-service
