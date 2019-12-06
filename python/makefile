help:
	@echo "\n\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'\`'"
	@echo "\`  create          create k8s deployment & service '"
	@echo "\`  apply           apply k8s config changes        '"
	@echo "\`  deps            install dependencies using pip  '"
	@echo "\`  local-run       run locally                     '"
	@echo "\`  build-run       build and run on minikube       '"
	@echo "\`  run             run on minikube cluster         '"
	@echo "\`  clean           remove unwanted files           '"
	@echo "\`  lint            check style with flake8         '"
	@echo "\`  test            run test using py.test          '"
	@echo "\`  test-cov[-html] show test coverage [in html]    '"
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

clean:
	./manage.py clean

lint:
	flake8 . --exclude __pycache__,venv

test:
	py.test tests

test-cov:
	py.test --cov=./ tests/

test-cov-html:
	py.test --cov=./ --cov-report=html tests/
