# The Solution

# What is this?

You have been looking for a place to throw your git repositories that isn't in the cloud.

But you also need an automated CI/CD solution.

And an issue tracker.

And artifact hosting.

And ...

Look no further. The Solution is here!

# Migration to Deno

Once Deno wraps up http2 and runs on ARM64/musl, this project will migrate to using Deno over nodejs.

# Dogfood

This project is hosted on GitHub because I don't trust Spectrum Internet to reliably serve this repository. The cloud can still be a good solution for certain problems.

# Components

## Artifact Repository

Repository for your artifacts. Coming soon!

## Automation

Automate your processes.

Attach to code repository events and potentially other events in the future as well.

## Code Repository

`git` hosting. Hopefully other repository hosting in the future.

**Note** In keeping with simplicity, setting up a new `git` repository means initializing a bare `git` repository behind-the-scenes.

Once the repository has been initialized, hook callbacks are implemented to fulfill your event-driven architecture needs.

## Issue Tracker

Track issues.

## Portal

Your method of managing the madness. The portal folder contains the source for running the administration portal to configure the other components.

© 2021 Nathan Blair
