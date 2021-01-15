Server that listens for for `git`-related requests and handles them appropriately.

# API functions

## `create`

Creates a new repository with a given `name`.

### Parameters (bold denotes required parameter)

- **`name`**
- `template` - template directory to use for initial bare repository (send as compressed archive).

  This would be most useful for uploading custom hooks
  Any `.git` file not uploaded will use the default from `git init`.

- `default_branch_name`

### Example Requests

- **TODO**

## `read`

Returns information about a repository.

### Parameters (bold denotes required parameter)

- `name` - repository name
- `file_tree`
- `ownership_tree`

### Example Requests

- **TODO**

### Return Schema

<!-- TODO -->

```json
{}
```

## `update`

Update repository (`.git`) files.

### Parameters (bold denotes required parameter)

- **`name`**
- **`files`** - `.git` files to be updated (send as compressed archive)

### Example Requests

- **TODO**

## `delete`

Delete repository (`.git`) files (replaces with default).

### Parameters (bold denotes required parameter)

- **`name`**
- **`file_names`** - `.git` file names to be deleted (can use wildcards)

### Example Requests

- **TODO**
