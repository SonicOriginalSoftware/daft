package main

import (
	"conductor/generated"
	"conductor/lib"
)

func main() {
	lib.Main(generated.RegisterRunnerServer, &Service{})
}
