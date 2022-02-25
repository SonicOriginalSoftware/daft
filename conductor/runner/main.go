package main

import (
	"log"
	"os"

	"runner/lib"
	"runner/service"
)

func main() {
	outlog := log.New(os.Stdout, "", log.LstdFlags)
	errlog := log.New(os.Stderr, "[ERROR] ", log.LstdFlags)

	interrupt := lib.RegisterInterrupt(outlog)

	outlog.Printf("Spinning up service...")

	defer close(interrupt)

	service, err := service.New()
	if err != nil {
		errlog.Fatalf("%v", err)
	}

	// FIXME Eventually the Run method will return a goroutine or channel
	// that will be awaited in the below select statement
	err = service.Run()
	if err != nil {
		errlog.Fatalf("%v", err)
	}

	interrupted := false
	for !interrupted {
		select {
		case s := <-interrupt:
			outlog.Printf("Service stop requested: %v\n", s)
			interrupted = true
		}
	}

	outlog.Printf("Service stopped!")
}
