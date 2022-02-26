package service

import (
	"conductor/generated"
	"context"
	"os/exec"
)

// Service contains runner service properties
type Service struct {
	generated.UnimplementedRunnerServer
	// TODO Do we need a port?
	// We have to be listening for outside communication SOMEHOW
}

// Run a Job
func (rs *Service) Run(_ context.Context, job *generated.Job) (*generated.Nil, error) {
	workingDirectory := ""

	cmd := exec.Command(job.Command)
	cmd.Env = job.Env
	cmd.Dir = workingDirectory

	// cmd.Stdout =
	// cmd.Stderr =

	return &generated.Nil{}, cmd.Run()
}
