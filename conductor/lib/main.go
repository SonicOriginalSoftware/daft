package lib

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"

	"google.golang.org/grpc"
)

var port = lookupPort()

// Init initializes shared variables among all Services
func Init() (
	outlog *log.Logger,
	errlog *log.Logger,
	listener net.Listener,
	grpcServer *grpc.Server,
	parentContext context.Context,
	cancel context.CancelFunc,
	err error,
) {
	outlog = log.New(os.Stdout, "", log.LstdFlags)
	errlog = log.New(os.Stderr, "[ERROR] ", log.LstdFlags)

	parentContext, cancel = context.WithCancel(context.Background())

	outlog.Printf("Spinning up service...")

	listener, err = net.Listen("tcp", fmt.Sprintf(":%v", port))
	if err != nil {
		log.Printf("failed to listen: %v", err)
		return
	}

	grpcServer = grpc.NewServer([]grpc.ServerOption{}...)

	return
}

// Main wraps the main functionality of all servers
func Main(
	parentContext context.Context,
	outlog *log.Logger,
	errlog *log.Logger,
	listener net.Listener,
	grpcServer *grpc.Server,
	cancel context.CancelFunc,
) (err error) {
	interrupt, _ := signal.NotifyContext(parentContext, os.Interrupt, os.Kill)

	served := make(chan error, 1)
	go func() { served <- grpcServer.Serve(listener) }()
	defer close(served)

	interrupted := false
	for !interrupted {
		select {
		case err = <-served:
			outlog.Printf("Server stopped: %v\n", err)
		case done := <-interrupt.Done():
			outlog.Printf("Service stop requested: %v\n", done)
			outlog.Printf("Gracefully shutting down server...\n")
			grpcServer.GracefulStop()
			outlog.Printf("Gracefully shut down server!\n")
		}
		interrupted = true
	}

	outlog.Printf("Service stopped!")
	return
}
