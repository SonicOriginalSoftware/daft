A FIFO queue of pipeline stages and jobs.

Once the pipeline is properly queued it needs to be parsed to determine the stages and jobs of the pipeline, generate placeholders for artifacts, cache `env` variables used for stages and jobs, etc.

It is the job of the queue, once the pipeline is parsed, to find a runner (or runners) applicable for the next job(s) and send the job commands to it/them.

It will then await the runner's completion of those job's commands.

It will then follow the pipeline's instructions for handling the success or failure of that job's commands using the `if` statements of the pipeline.
