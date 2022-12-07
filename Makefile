.PHONY: betest fetest test belint felint lint

betest:
	@cd backend && make test
fetest:
	@cd frontend && make citest
test: betest fetest
belint:
	@cd backend && make lint
felint:
	@cd frontend && make lint
lint: belint felint
