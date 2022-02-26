package lib

import (
	"os"
	"os/signal"
)

// RegisterInterrupt registers an interrupt channel
func RegisterInterrupt() (interrupt chan os.Signal) {
	interrupt = make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, os.Kill)
	return
}
