.PHONY: test lint

test:
	docker ps -qf name=fck_backend | grep "." > /dev/null || (echo "****** Run \`docker-compose up\` first! ******" && false)
	docker exec -it fck_backend /bin/bash -c "pip install -r requirements.txt && python -m pytest"

lint:
	docker ps -qf name=fck_backend | grep "." > /dev/null || (echo "****** Run \`docker-compose up\` first! ******" && false)
	docker exec -it fck_backend /bin/bash -c "black . && flake8 ."
