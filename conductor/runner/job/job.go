package job

import (
	"log"
	"os/exec"
)

// Job is a data structure model of a job
type Job struct {
	outlog *log.Logger
	errlog *log.Logger

	cmd exec.Cmd
}

// Run a job
func (job *Job) Run() error {
	return job.cmd.Run()
}

// New creates a new instance of a job from a raw job definition coming from a queue
func New(
	rawJob *[]byte,
	outlog *log.Logger,
	errlog *log.Logger,
) (*Job, error) {
	// FIXME Get the script from the rawJob
	command := ""
	// FIXME Get the env from the rawJob
	env := make([]string, 0)
	// FIXME Set a clean working directory for each job
	workingDirectory := ""

	cmd := exec.Command(command)

	// FIXME Set stdout and stderr to log to files in the working directory
	cmd.Stdout = outlog.Writer()
	cmd.Stderr = errlog.Writer()

	cmd.Env = env
	cmd.Dir = workingDirectory

	job := &Job{
		cmd: *cmd,
	}

	return job, nil
}