Pipelines are built using `yaml` files. Example syntax is included with [the example](example.yaml).

# Pipeline status

Pipelines can be customized to send statuses to your monitor of choice (the included portal, GitHub Status Checks, etc.).

There are some ready-made functions available for sending pipeline status to the included portal.

Pull-Requests of functions to send pipeline status to other monitors are welcome.

This leaves the granularity of the reporting directly to you - status of individual steps, jobs, stages, etc.

# Basic syntax

Pipelines are broken down into Stages, then Jobs, then Steps.

- `events`: map of events that will trigger this pipeline
- `env`: global env variables used by all stages/jobs
- `stages`: occur sequentially, top-level
  - `env`: Environment variables used by all jobs in this stage
  - `resources`: scripts, artifacts, files to be included in all jobs in this stage (represented as paths)
  - `jobs`: occur in parallel, belonging to a `stage`, executed on a runner
    - `env`: Environment variables usable by this job
    - `resources`: scripts, artifacts, files to be included (sent along with the pipeline steps) when this job runs (represented as paths)
    - `attributes`
      - `shell` (posix, powershell)
      - `OS` (windows, linux, macOS, any)
      - `arch` (x86_64, arm64)
    - `steps`: the individual shell commands
    - `artifacts`: map of artifact names and the path of the artifact to be uploaded

      Artifacts are uploaded as a single file if the artifact path is a single file, otherwise they will be archived, compressed, and uploaded.

# Sharing execution between pipelines

Use the `resources` array and list paths to scripts or such to be shared across stages/jobs.

# Resources and artifacts

Artifact names should not conflict with working directory folder or file names if used as a resource for that stage/job, depending on the nature of the artifact.

They should also not conflict with other shared resource folder or file names.

They should also be unique throughout the entire pipeline; i.e. a `build` stage should not have two jobs that each define an artifact named `build`.

Conflicting artifact names in the same pipeline will overwrite one another; i.e. the last job to upload an artifact with an existing name will have that artifact used as a subsequent resource.

To use a previous artifact as a resource, list the name of the artifact.

The artifact will be accessible to that stage/job through either the exact path if a single file is used as an artifact, or by a folder with the name of the artifact.

## Example

A `build` job produces a directory of binaries needed to be uploaded by a later `deploy` stage job.

In the `build` job, the `yaml` syntax would include:

```yaml
    ...
    artifacts:
      build: 'build_x86_64_folder'
    ...
```

Then any job in the `deploy` stage could reference that artifact by including this in the `yaml` syntax:

```yaml
    ...
    resources: ['build']
    ...
```

The files originally at the `build_x86_64` folder are all now under the folder `build` in the current working directory.

## Another example

A `build` job produces an image needed to be tested against during a `test` job in another stage.

In the `build` job, the `yaml` syntax would include:

```yaml
    ...
    artifacts:
      test_image: 'path/to/image.png'
    ...
```

Then in the later stage that includes that test job, that artifact would be included by using this `yaml` syntax:

```yaml
    ...
    resources: ['test_image']
    ...
```

The `image.png` originally located at the path `path/to/` is now accessible at `./test_image.png`.

# Artifact lifetime

Artifacts defined in the pipeline are only available for the life of the pipeline.

They are meant to be shared between stages and are only applicable to be uploaded by a given job.

That is, they are more 'pipeline artifacts' than true build artifacts.

To keep artifacts living in a more perpetual state you can upload to the included `artifact-repository` or your artifact repository of choice.

# Confidential information/secrets

Secrets can be stored with the included `key-vault` component and retrieved from there using some included/pre-defined functions.

You can also retrieve keys stored through Azure Key Vault or some other key manager using whatever means that provider has accessible (`curl` through a REST API?).

# Logging

Logging of command output is sent to the runner `stdout` responsible for that pipeline.

<!-- How do we view the log? -->

**TODO**

# Security

<!-- If someone logs a secret value, how do we mask it? -->

**TODO**
