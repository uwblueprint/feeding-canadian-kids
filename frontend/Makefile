.PHONY: test lint

test:
	docker ps -qf name=fck_frontend | grep "." > /dev/null || (echo "****** Run \`docker-compose up\` first! ******" && false)
	docker exec -it fck_frontend yarn test
citest:
	docker ps -qf name=fck_frontend | grep "." > /dev/null || (echo "****** Run \`docker-compose up\` first! ******" && false)
	docker exec -it fck_frontend yarn test:ci

lint:
	docker ps -qf name=fck_frontend | grep "." > /dev/null || (echo "****** Run \`docker-compose up\` first! ******" && false)
	docker exec -it fck_frontend /bin/bash -c "yarn fix"
