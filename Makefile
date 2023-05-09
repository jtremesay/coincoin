REPOSITORY = killruana/coincoin
TAG = latest

all: image

image-deps:
	docker build --target deps -t ${REPOSITORY}-deps:${TAG} .

image:
	docker build -t ${REPOSITORY}:${TAG} .

pull:
	docker pull ${REPOSITORY}:${TAG}

push: image
	docker push ${REPOSITORY}:${TAG}

run: image
	docker run -e SECRET_KEY -p 8000:8000 ${REPOSITORY}:${TAG}


up: image-deps
	docker compose -f docker-compose.dev.yaml up --remove-orphans

.PHONY: image-deps image pull push run up
