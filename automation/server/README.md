Server that listens for events, retrieves their payload, and then forwards the appropriate pipeline for that event on to the [Conductor](../conductor/README.md)

# Endpoints

- `handle` - Retrieves event payload and forwards pipeline to conductor for queueing
