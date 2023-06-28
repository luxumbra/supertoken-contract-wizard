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
  receiver: '',
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

  addBase(c, allOpts.name, allOpts.symbol);
  addPremint(c, allOpts.receiver, allOpts.initialSupply);

  setInfo(c, info);

  if (allOpts.burnable) {
    
  }

  if (allOpts.mintable) {
    addMintable(c, allOpts.receiver, allOpts.initialSupply);
  }

  if (allOpts.capped) {
    
  }

  if (allOpts.maticBridge) {
    
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

function addBurnable(c: ContractBuilder) {
  c.addParent({
    name: 'ERC20Burnable',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol',
  });
}

function addMintable(c: ContractBuilder, receiver: string, amount: number) {
  c.addFunctionCode(`mint(${receiver}, ${amount})`, functions.mint);
}

function addCapped(c: ContractBuilder) {
  c.addParent({
    name: 'ERC20Burnable',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol',
  });
}

function addMaticBridge(c: ContractBuilder) {
  c.addParent({
    name: 'ERC20Burnable',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol',
  });
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