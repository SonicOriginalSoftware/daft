package main

import (
	"fmt"
	"log"
	"net"
	"os"

	"conductor/generated"
	"conductor/runner/lib"
	"conductor/runner/service"

	"google.golang.org/grpc"
)

const defaultPort = "8080"

var port = defaultPort

func init() {
	found := false
	if port, found = os.LookupEnv("PORT"); !found {
		port = defaultPort
	}
}

func main() {
	outlog := log.New(os.Stdout, "", log.LstdFlags)
	errlog := log.New(os.Stderr, "[ERROR] ", log.LstdFlags)

	outlog.Printf("Spinning up service...")

	listener, err := net.Listen("tcp", fmt.Sprintf(":%v", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer([]grpc.ServerOption{}...)

	generated.RegisterRunnerServer(grpcServer, &service.Service{})

	served := lib.RegisterServer(grpcServer, listener, *errlog)
	defer close(served)

	interrupt := lib.RegisterInterrupt()
	defer close(interrupt)

	interrupted := false
	for !interrupted {
		select {
		case s := <-served:
			outlog.Printf("Server stopped: %v\n", s)
		case s := <-interrupt:
			outlog.Printf("Service stop requested: %v\n", s)
		}
		interrupted = true
	}

	outlog.Printf("Service stopped!")
}
