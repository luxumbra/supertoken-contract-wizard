import { CommonOptions, defaults as commonDefaults, withCommonDefaults } from './common-options';
import { Contract, ContractBuilder } from './contract';
import { printContract } from './print';
import { setInfo } from './set-info';

export interface CappedSuperTokenOptions extends CommonOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  receiver: string;
  mintable: boolean;
  burnable: boolean;
  capped: boolean;
  maticBridge: boolean;
}

export const cappedSupertokenDefaults: Required<CappedSuperTokenOptions> = {
  name: 'MyToken',
  symbol: 'MTK',
  initialSupply: 0,
  receiver: '',
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
  mintable: false,
  burnable: false,
  capped: false,
  maticBridge: false,
} as const;

function withDefaults(opts: CappedSuperTokenOptions): Required<CappedSuperTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    initialSupply: opts.initialSupply ?? cappedSupertokenDefaults.initialSupply,
    receiver: opts.receiver || cappedSupertokenDefaults.receiver,
  };
}

export function printCappedSuperToken(opts: CappedSuperTokenOptions = cappedSupertokenDefaults): string {
  return printContract(buildCappedSuperToken(opts));
}

export function buildCappedSuperToken(opts: CappedSuperTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { access, info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol);
  addPremint(c, allOpts.receiver, allOpts.initialSupply);

  setInfo(c, info);

  if (allOpts.mintable) {
    addMintable(c, allOpts.receiver, allOpts.initialSupply);
  }

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  c.addParent({
    name: 'CappedSuperToken',
    path: '../custom-supertokens/contracts/CappedSupertoken.sol',
  });

  c.addConstructorCode(`_initialize(factory, "${name}", "${symbol}");`);
}

function addPremint(c: ContractBuilder, receiver: string, initialSupply: number) {
  c.addFunctionCode(`_mint(${receiver}, ${initialSupply})`, functions._mint);
}

function addMintable(c: ContractBuilder, receiver: string, amount: number) {
  c.addFunctionCode(`mint(${receiver}, ${amount})`, functions.mint);
}

//wtf
export const functions = {
  _mint: {
    kind: 'internal' as const,
    name: '_mint',
    args: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
  },
  mint: {
    kind: 'external' as const,
    name: 'mint',
    args: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'userData', type: 'bytes' },
    ]
  },
};