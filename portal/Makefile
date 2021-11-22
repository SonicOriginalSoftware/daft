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

app/node_modules:
	cd app && npm ci

app: app/node_modules
