CONDUCTOR_PATH := $(realpath $(dir $(lastword $(MAKEFILE_LIST))))
PROTO_PATH := $(CONDUCTOR_PATH)/protos

GENERATED_FILES := $(CONDUCTOR_PATH)/job.pb.go $(CONDUCTOR_PATH)/pipeline.pb.go

clean-proto:
	-rm $(GENERATED_FILES)

clean: clean-proto

$(GENERATED_FILES) &: $(PROTO_PATH)/*.proto
	protoc --proto_path=$(PROTO_PATH) --go_out=$(CONDUCTOR_PATH) $(PROTO_PATH)/*.proto

proto: $(GENERATED_FILES)

.PHONY: clean-proto proto
