help:
	@echo "\n\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'"
	@echo "  create          create k8s deployment & service"
	@echo "  apply           apply k8s config changes"
	@echo "  deps            install dependencies using pip"
	@echo "  local-run       run locally"
	@echo "  build-run       build and run on minikube"
	@echo "  run             run on minikube cluster"
	@echo "\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\n"

create:
	kubectl create -f deployment.yaml \
	&& kubectl create -f service.yaml

apply:
	kubectl apply -f deployment.yaml \
	&& kubectl apply -f service.yaml

deps:
	pip3 install -r requirements.txt

local-run:
	@./manage.py urls \
	&& echo "\n\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\n" \
	&& ./manage.py server

build-run:
	docker build -t tango-python . \
	&& kubectl rollout restart deployment tango-python-deployment \
	&& sleep 5 \
	&& minikube service tango-python-service

run:
	minikube service tango-python-service
