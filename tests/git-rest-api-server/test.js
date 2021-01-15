import { strict as assert } from 'assert'
// import { resolve } from 'path'

// import { fetch } from '@sonicoriginalsoftware/fetcher/fetch.js'
// import { stop } from '@sonicoriginalsoftware/rest-api-server/server.js'
// import { config } from '@sonicoriginalsoftware/rest-api-server/server-config.js'

// import { start_server } from '../../code-repository/git/server/server.js'

export const id = "Git REST API Server"

export const assertions = {
  'Should be able to get information from the server': {
    function: async () => {
      assert.ok(true)
    },
    skip: true
  },
}
