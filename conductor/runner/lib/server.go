package lib

import (
	"log"
	"net"

	"google.golang.org/grpc"
)

// RegisterServer registers a server channel
func RegisterServer(
	grpcServer *grpc.Server,
	listener net.Listener,
	errlog log.Logger,
) (served chan error) {
	served = make(chan error, 1)
	go func() {
		served <- grpcServer.Serve(listener)
	}()
	return
}
