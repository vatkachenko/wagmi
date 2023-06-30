import { config, testChains } from '@wagmi/test'
import { expect, test } from 'vitest'

import { getTokenQueryOptions } from './getToken.js'

test('default', () => {
  expect(getTokenQueryOptions(config)).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "token",
        {},
      ],
    }
  `)
})

test('parameters: chainId', () => {
  expect(
    getTokenQueryOptions(config, { chainId: testChains.anvil.id }),
  ).toMatchInlineSnapshot(`
    {
      "queryFn": [Function],
      "queryKey": [
        "token",
        {
          "chainId": 123,
        },
      ],
    }
  `)
})