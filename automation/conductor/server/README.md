# `automation` communication

Receives requests to queue pipelines from `automation` server.

`automation` server only cares about whether the conductor successfully adds the pipeline to a queue; the response should not dictate whether a runner has been assigned. It can report on where in the queue that pipeline was seated.

## Endpoints

- `queue` - will report back a failing status code if the pipeline could not be added to the queue. Otherwise responds with a `200`.

# `portal` communication

Reports to the portal with the status of the runners as well as receiving information about runners the user wants to configure from the portal.

## Endpoints

- `add` - add a runner to be managed by the conductor
- `update` - update a runner to be managed by the conductor
- `remove` - remove a runner to be managed by the conductor
- `list` - list runners managed by the conductor

  This can be filtered with runner attributes
