package service

// Service contains runner service properties
type Service struct {
	// TODO Do we need a port?
	// We have to be listening for outside communication SOMEHOW
}

// Run the runner service
func (service *Service) Run() (err error) {
	// FIXME This needs to be changed into a goroutine that can be `select`ed from
	// FIXME What are we going to await? Do we run an HTTP server? A gRPC service?
	return nil
}

// New creates a new Service instance
func New() (service *Service, err error) {
	// TODO Initialize necessary variables from the environment defining
	// hosting information about the Service
	return &Service{}, err
}
