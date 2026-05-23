.PHONY: up up-prod down migrate seed fresh deploy send db thinker shell install

COMPOSE=docker compose
PHP=$(COMPOSE) exec app php
ARTISAN=$(PHP) artisan

up:
	$(COMPOSE) up -d

up-prod:
	$(COMPOSE) -f docker-compose.yml up -d --build
	$(ARTISAN) migrate --force
	$(ARTISAN) config:cache
	$(ARTISAN) route:cache
	$(ARTISAN) view:cache

down:
	$(COMPOSE) down

migrate:
	$(ARTISAN) migrate

seed:
	$(ARTISAN) db:seed

fresh:
	$(ARTISAN) migrate:fresh --seed

deploy:
	git pull origin main
	$(COMPOSE) up -d --build
	$(ARTISAN) migrate --force
	$(ARTISAN) config:cache
	$(ARTISAN) route:cache
	$(ARTISAN) view:cache
	npm run build

db:
	$(COMPOSE) exec db mysql -u desafiotenis -psecret desafiotenis

thinker:
	$(ARTISAN) tinker

shell:
	$(COMPOSE) exec app bash

install:
	$(COMPOSE) run --rm app composer install
	$(COMPOSE) run --rm app cp .env.example .env || true
	$(COMPOSE) run --rm app php artisan key:generate
	npm install
	$(COMPOSE) up -d
	$(ARTISAN) migrate --seed

send:
	npm run lint 2>/dev/null || true
	@read -p "Mensagem do commit: " msg; \
	git add -A && \
	git commit -m "$$msg" && \
	git push
