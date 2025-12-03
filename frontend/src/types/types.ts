export interface PermitView {
  token: string
  owner: string
  spender: string
  allowance: bigint
  nonce: bigint
  domainSeparator: string
  name: string
  symbol: string
}
