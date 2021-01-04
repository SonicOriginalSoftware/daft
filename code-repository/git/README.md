# Server

Simple API server that can be used to initialize new remote repositories (`git init`).

It initializes new repos with pre-configured standard hooks that can be used with the included `automation` component or other CI/CD tools.

See [the git server doc](server/README.md).

# Template

The default template directory to use when initializing a new `git` remote repository.

<!-- Where is the appropriate place to handle branch merging validation? -->
<!-- Looking for a server-side pre-merge-commit -->
<!-- I think this implies that the remote will not be a `bare` repository... -->

# Hooks (server-side)

**NOTE** When implementing the scripts, it is best-practice to stick with POSIX-compliant shell code.

## `pre-rebase`

<!-- Is this necessary if we implement pre-merge-commit? -->

**TODO** What happens here by default?

## `pre-merge-commit`

**TODO** What happens here by default?

## `pre-receive`

**TODO** What happens here by default?

## `update`

**TODO** What happens here by default?

## `post-receive`

**TODO** What happens here by default?

