package main

import (
	"conductor/generated"
	"conductor/lib"
	"context"
	"log"
	"net"

	"google.golang.org/grpc"
)

var (
	outlog        *log.Logger
	errlog        *log.Logger
	listener      net.Listener
	grpcServer    *grpc.Server
	parentContext context.Context
	cancel        context.CancelFunc
)

func init() {
	var err error
	outlog, errlog, listener, grpcServer, parentContext, cancel, err = lib.Init()
	if err != nil {
		log.Fatalf("%v", err)
	}
}

func main() {
	defer cancel()

	service := newService(&parentContext, &cancel)
	generated.RegisterRunnerServer(grpcServer, service)

	err := lib.Main(parentContext, outlog, errlog, listener, grpcServer, cancel)
	if err != nil {
		errlog.Fatalf("%v", err)
	}
}
