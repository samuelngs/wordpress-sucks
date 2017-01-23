
up:
	@sudo chown -R $(whoami):$(id -gn) plugins themes
	@docker-compose up -d

stop:
	@docker-compose stop

rm:
	@docker-compose rm -f
