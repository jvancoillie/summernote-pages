# Setup ————————————————————————————————————————————————————————————————————————————————————————————————————————————————
PROJECT    = summernote-pages
PWD = $(shell pwd)

.SILENT:
.DEFAULT_GOAL := help

# Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

.DEFAULT_GOAL := help
## —— Make file ————————————————————————————————————————————————————————————————————————————————————————————
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z\-\_0-9\.@]+:.*?##.*$$)|(^##)' $(firstword  $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'


## —— Docker ———————————————————————————————————————————————————————————————————————————————————————————————
.PHONY: bash
bash: ## run bash in the container
	docker run -it -v $(PWD):/usr/src/app $(PROJECT):latest /bin/bash

install: ## Build the container
	docker run -it -v $(PWD):/usr/src/app $(PROJECT):latest yarn install

watch: ## run webpack watch
	docker run -it -v $(PWD):/usr/src/app $(PROJECT):latest yarn watch

build: ## Build the container
	docker build -t $(PROJECT):latest .
