import {
  SwitchChainError as SwitchChainError_,
  UserRejectedRequestError,
} from 'viem'

import { type Config } from '../config.js'
import type { BaseError } from '../errors/base.js'
import { ChainNotConfiguredError } from '../errors/config.js'
import { SwitchChainNotSupportedError } from '../errors/connector.js'
import { type ProviderNotFoundError } from '../errors/connector.js'
import type { ConnectorParameter } from '../types/properties.js'
import type { Evaluate } from '../types/utils.js'

export type SwitchChainParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = Evaluate<
  {
    chainId: chainId | config['chains'][number]['id']
  } & ConnectorParameter
>

export type SwitchChainReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = Extract<config['chains'][number], { id: chainId }>

export type SwitchChainError =
  | ProviderNotFoundError
  | SwitchChainError_
  | UserRejectedRequestError
  | BaseError
  | Error

/** https://wagmi.sh/core/actions/switchChain */
export async function switchChain<
  config extends Config,
  chainId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: SwitchChainParameters<config, chainId>,
): Promise<SwitchChainReturnType<config, chainId>> {
  const { chainId } = parameters

  const connection = config.state.connections.get(
    parameters.connector?.uid ?? config.state.current!,
  )
  if (connection) {
    const connector = connection.connector
    if (!connector.switchChain)
      throw new SwitchChainNotSupportedError({ connector })
    const chain = await connector.switchChain({ chainId })
    return chain as SwitchChainReturnType<config, chainId>
  }

  const chain = config.chains.find((x) => x.id === chainId)
  if (!chain) throw new ChainNotConfiguredError()
  config.setState((x) => ({ ...x, chainId }))
  return chain as SwitchChainReturnType<config, chainId>
}