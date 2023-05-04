REPOSITORY = killruana/coincoin
TAG = latest

image:
	docker build -t ${REPOSITORY}:${TAG} .

pull:
	docker pull ${REPOSITORY}:${TAG}

push: image
	docker push ${REPOSITORY}:${TAG}

run: image
	docker run -e SECRET_KEY -p 8000:8000 ${REPOSITORY}:${TAG}

up: image
	docker compose up --remove-orphans

.PHONY: image pull push run up
