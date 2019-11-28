create:
	kubectl create -f deployment.yaml \
	&& kubectl create -f service.yaml

apply:
	kubectl apply -f deployment.yaml \
	&& kubectl apply -f service.yaml

run:
	docker build -t tango-python . \
	&& kubectl rollout restart deployment tango-python-deployment \
	&& minikube service tango-python-service
