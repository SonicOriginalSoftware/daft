# General
This folder contains code necessary to run a server that listens for for git-related requests and handles them appropriately.

Could be thought of as a git backend API.

# API functions

## `create`

### Parameters (bold denotes required parameter)

- **`name`**
- `template` - template directory to use for initial bare repository (send as compressed archive).

    This would be most useful for uploading custom hooks
    Any `.git` file not uploaded will use the default from `git init --bare`.
- `default_branch_name`

### Notes

Creates a new repository with a given `name`.

This new repository will be given standard `git hooks`, optionally with extras provided during initialization.

### Example Requests

- **TODO**

## `read`

### Parameters (bold denotes required parameter)

- `name` - repository name
- `file_tree`
- `ownership_tree`

### Example Requests

- **TODO**

## `update`

### Parameters (bold denotes required parameter)

- **`name`**
- **`files`** - Update repository `.git` files (send as compressed archive)

### Example Requests

- **TODO**

## `delete`

### Types

### Parameters

- **`name`**
- **`supplemental_hooks`** - Update repository hooks (add/remove/modify hook files)

### Example Requests

- **TODO**
