import { CommonOptions, defaults as commonDefaults, withCommonDefaults } from './common-options';
import { Contract, ContractBuilder } from './contract';
import { printContract } from './print';
import { setInfo } from './set-info';

export interface PureSuperTokenOptions extends CommonOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  receiver: string;
}

export const defaults: Required<PureSuperTokenOptions> = {
  name: 'MyToken',
  symbol: 'MTK',
  initialSupply: 0,
  receiver: '',
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
} as const;

function withDefaults(opts: PureSuperTokenOptions): Required<PureSuperTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    initialSupply: opts.initialSupply ?? defaults.initialSupply,
    receiver: opts.receiver || defaults.receiver,
  };
}

export function printPureSuperToken(opts: PureSuperTokenOptions = defaults): string {
  return printContract(buildPureSuperToken(opts));
}

export function buildPureSuperToken(opts: PureSuperTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { access, info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol);
  addPremint(c, allOpts.receiver, allOpts.initialSupply);

  setInfo(c, info);

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
  //@ts-ignore
  c.addFunctionCode(`_mint(${receiver}, ${initialSupply}`, functions._mint);
}

export const functions = {
  _mint: {
    kind: 'internal' as const,
    args: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
  },
};