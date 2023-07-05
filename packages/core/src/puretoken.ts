import { CommonOptions, defaults as commonDefaults, withCommonDefaults } from './common-options';
import { Contract, ContractBuilder } from './contract';
import { printContract } from './print';
import { setInfo } from './set-info';

export interface PureSuperTokenOptions extends CommonOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  receiver: string;
  mintable: boolean;
  burnable: boolean;
  capped: boolean;
  maticBridge: boolean;
}

export const pureSupertokenDefaults: Required<PureSuperTokenOptions> = {
  name: 'MyToken',
  symbol: 'MTK',
  initialSupply: 0,
  receiver: '0x1A6784925814a13334190Fd249ae0333B90b6443',
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
  mintable: false,
  burnable: false,
  capped: false,
  maticBridge: false,
} as const;

function withDefaults(opts: PureSuperTokenOptions): Required<PureSuperTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    initialSupply: opts.initialSupply ?? pureSupertokenDefaults.initialSupply,
    receiver: opts.receiver || pureSupertokenDefaults.receiver,
  };
}

export function printPureSuperToken(opts: PureSuperTokenOptions = pureSupertokenDefaults): string {
  return printContract(buildPureSuperToken(opts));
}

export function buildPureSuperToken(opts: PureSuperTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { access, info } = allOpts;
  console.log(allOpts.receiver, 'test')
  addBase(c, allOpts.name, allOpts.symbol);
  addPremint(c, allOpts.receiver, allOpts.initialSupply);

  setInfo(c, info);

  if (allOpts.burnable) {
    addBurnable(c)
  }

  if (allOpts.mintable) {
    addMintable(c, allOpts.receiver, allOpts.initialSupply);
  }

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  c.addParent({
    name: 'SuperTokenBase',
    path: '../custom-supertokens/contracts/PureSupertoken.sol',
  });

  c.addConstructorCode(`_initialize(factory, "${name}", "${symbol}");`);
}

function addPremint(c: ContractBuilder, receiver: string, initialSupply: number) {
  c.addFunctionCode(`_mint(${receiver}, ${initialSupply})`, functions._mint);
}

function addBurnable(c: ContractBuilder, amount?: number, ) {
  c.addFunctionCode(`burn(${amount})`, functions.burn);
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
  burn: {
    kind: 'external' as const,
    name: 'burn',
    args: [
      { name: 'amount', type: 'uint256' },
      { name: 'userData', type: 'bytes' },
    ]
  }
};