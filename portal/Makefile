.PHONY: \
	clean-app \
	clean-server \
	clean-all

clean-app:
	rm -rf app/node_modules app/build

clean-server:
	rm -rf server/target

clean-all: clean-app clean-server

server: server/target/debug/portal-server
	cargo build --manifest-path server/Cargo.toml

package-lock.json: app/package.json
	cd app && npm i

app/node_modules: app/package-lock.json
	cd app && npm ci

app/public/build/main.js: app/node_modules
	cd app && npm run build

app: app/public/build/main.js
