Server that listens for events, retrieves their payload, and then forwards the appropriate pipeline for that event on to the [Conductor](../conductor/README.md)

# Endpoints

- `handle` - begins the [Process](#process)
- `create` - create a new mapping of an event to pipeline(s)
- `add` - add a pipeline to an existing event-pipeline map
- `delete` - remove a pipeline from an existing event-pipeline map
- `list` - list events and their associated pipelines

  This can be filtered for a particular event or reverse-filtered for a particular pipeline

# Process

1. Listens for events (ongoing)
2. Retrieves event payload
3. Parses event payload to map event to pipeline(s)
4. Forwards pipeline to conductor for queueing

If any of the above steps fail, the `automation` server will report the error back to the `portal`.
