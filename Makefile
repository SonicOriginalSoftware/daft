.PHONY: clean clean-all ca
.DEFAULT_GOAL := help

define USAGE
  daft
endef

clean:
ca clean-all:

help:
	$(info $(USAGE))
	@:
