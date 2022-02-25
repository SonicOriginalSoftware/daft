.PHONY: \
	clean-app \
	clean-server \
	clean-all

clean-app:
	rm -rf app/node_modules app/build

clean-all: clean-app

package-lock.json: app/package.json
	npm i

app/node_modules: app/package-lock.json
	npm ci

app/public/build/main.js: app/node_modules
	npm run build

app: app/public/build/main.js
