# Portal Features

- initialize portals
- remove portals
- modify portals
  - add/remove sub-portals
  - add/remove components
  - modify components (see [Portal Management](#portal-management))

# Backend

The choice of backend should be very open.

As a recommendation to get a production-ready state ready quickly, take a look at [server](https://github.com/SonicOriginalSoftware/server), also by Sonic Original Software.

## **Examples**

Each of the components can be used and grouped arbitrarily and managed through the `portal`.

- create a `portal` service for yourself and one for your company

- integrate the `wiki` component for both your personal and company `portal` services

- integrate a top-level `issue-tracker` component available for your company `portal` service

- create sub-portals inside your company for an operating system and one for a web app framework

- in the web app framework portal, integrate the `artifact-repository` component that can be shared amidst all of the framework code repositories

- add a sub-portal of the web app framework for tooling, integrate a `safe` specifically for that portal, along with the `code-repository`, `conductor`, and `issue-tracker` components

- add a sub-portal of the web app framework for resources and integrate the `code-repository`, `conductor`, and `issue-tracker` components

- add a sub-portal of the web app framework for the app shell and integrate the `code-repository`, `conductor`, and `issue-tracker` components

# Portal Security

Authorization is inherited between portals (sub-portals will retain the same authorization as their parent portals).

# Portal Management

## Code Repository

### `git` Code Repository

- initialize new repositories
- rename existing repositories
- manage branches (defaults, renames, deletions, etc.)
- assign branch protections
- manage repository hooks
  - enable communication with top-level conductor or configure attaching other automation systems

## Conductor

- initialize a conductor
- deinitialize a conductor

## Issue Tracker

**TODO**

## Registries

**TODO**

## Artifact Repository

**TODO**

## Safe

**TODO**

## Wiki

**TODO**
