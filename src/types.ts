export interface Account {
  address: string,
  private_key: string,
  public_key: string
}

export interface Accounts {[address: string]: Account}

export interface KdfParams {
  dklen: number,
  salt: string,
  prf?: string,
  c?: number,
  n?: number,
  r?: number,
  p?: number
}

export interface V3KeystoreOptions {
  salt?: string,
  iv?: Buffer,
  kdf?: string,
  dklen?: number,
  c?: number,
  n?: number,
  r?: number,
  p?: number,
  prf?: string,
  cipher?: string,
  uuid?: Buffer
}

export interface V3Keystore {
  version: 3,
  id: string,
  address: string,
  crypto: {
    ciphertext: string,
    cipherparams: {
      iv: string
    },
    cipher: string,
    kdf: string,
    kdfparams: KdfParams,
    mac: string
  }
}

// export type EventType = "value" | "child_added" | "child_changed" | "child_removed";

export type SetMultiOperationType = "SET";

export type GetMultiOperationType = "GET";

export type SetOperationType = "SET_VALUE" | "INC_VALUE" | "DEC_VALUE" | "SET_RULE" | "SET_OWNER" | "SET_FUNC";

export type GetOperationType = "GET_VALUE" | "GET_RULE" | "GET_OWNER" | "GET_FUNC";

export interface SetOperation {
  type: SetOperationType;
  ref: string;
  value: any | undefined | null;
}

export interface SetMultiOperation {
  type: SetMultiOperationType;
  op_list: SetOperation[];
}

export interface GetOperation {
  type: GetOperationType;
  ref?: string;
}

export interface GetMultiOperation {
  type: GetMultiOperationType;
  op_list: GetOperation[];
}

export interface PathValueObject {
  ref: string;
  value: any | undefined | null;
}

// export interface PathRuleObject

export interface PathFuncObject {
  ref: string;
  value: string;
}

export interface TransactionBodyBase {
  parent_tx_hash?: string;
  operation: SetOperation | SetMultiOperation;
}

export interface ValueOnlyTransactionBodyBase {
  parent_tx_hash?: string;
  value?: any;
  ref?: string;
}

export interface TransactionInputBase {
  nonce?: number;
  address?: string;
}

export interface TransactionBody extends TransactionBodyBase {
  nonce: number;
  timestamp: number;
}

export interface TransactionInput extends TransactionBodyBase, TransactionInputBase {}

export interface ValueOnlyTransactionInput extends ValueOnlyTransactionBodyBase, TransactionInputBase {}

export interface SetMultiTransactionInput extends TransactionInputBase {
  parent_tx_hash?: string;
  op_list: SetOperation[];
}

export interface Transaction {
  hash: string;
  block_hash?: string;
  block_number?: number;
  index?: number;
  nonce: number;
  timestamp: number;
  address: string;
  operation: SetOperation | SetMultiOperation;
  parent_tx_hash?: string;
}

export interface TransactionResult {
  status: boolean,
  block_hash?: string,
  block_number?: number,
  hash: string,
  index?: number,
  address: string,
  parent_tx_hash?: string
}

export interface Block {
  number: number,
  hash?: string,
  parent_hash?: string,
  proposer?: string,
  validators?: string[],
  size: number,
  timestamp?: number,
  transactions: Transaction[] | string[]
}

export interface ListenerMap {
  [key: string]: Function[]
}

export interface EvalRuleInput {
  value: any,
  ref?: string,
  address?: string,
  timestamp?: number
}

export interface EvalOwnerInput {
  ref?: string,
  address?: string
}