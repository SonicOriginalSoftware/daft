package lib

import (
	"fmt"
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
)

var port = lookupPort()

// RegisterFunction is a function that registers a grpc.ServiceRegistrar and a ProtoServer
type RegisterFunction func(s grpc.ServiceRegistrar, srv ProtoServer)

// Main wraps the main functionality of all servers
func Main(registerFunction RegisterFunction, service ProtoServer) {
	outlog := log.New(os.Stdout, "", log.LstdFlags)
	errlog := log.New(os.Stderr, "[ERROR] ", log.LstdFlags)

	outlog.Printf("Spinning up service...")

	listener, err := net.Listen("tcp", fmt.Sprintf(":%v", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer([]grpc.ServerOption{}...)
	registerFunction(grpcServer, service)

	served := RegisterServer(grpcServer, listener, *errlog)
	defer close(served)

	interrupt := RegisterInterrupt()
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
