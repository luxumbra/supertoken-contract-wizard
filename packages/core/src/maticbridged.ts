import { CommonOptions, defaults as commonDefaults, withCommonDefaults } from './common-options';
import { Contract, ContractBuilder } from './contract';
import { premintPattern } from './erc20';
import { printContract } from './print';
import { setInfo } from './set-info';

export interface MaticBridgedSuperTokenOptions extends CommonOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  receiver: string;
  mintable: boolean;
  burnable: boolean;
  capped: boolean;
  ownable: boolean;
  maticBridge: boolean;
}

export const maticBridgedSuperTokenDefaults: Required<MaticBridgedSuperTokenOptions> = {
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
  ownable: false,
  maticBridge: false,
} as const;

function withDefaults(opts: MaticBridgedSuperTokenOptions): Required<MaticBridgedSuperTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    initialSupply: opts.initialSupply ?? maticBridgedSuperTokenDefaults.initialSupply,
    receiver: opts.receiver || maticBridgedSuperTokenDefaults.receiver,
  };
}

export function printMaticBridgedSuperToken(opts: MaticBridgedSuperTokenOptions = maticBridgedSuperTokenDefaults): string {
  return printContract(buildMaticBridgedSuperToken(opts));
}

export function buildMaticBridgedSuperToken(opts: MaticBridgedSuperTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { access, info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol);

  setInfo(c, info);

  if (allOpts.mintable) {
    addMintable(c, allOpts.receiver, allOpts.initialSupply);
  }

  if (allOpts.initialSupply > 0) {
    addPremint(c, allOpts.receiver, allOpts.initialSupply);
  }

  if (access === 'ownable') {
    addOwnable(c);
  }

  if (access === 'roles') {
    addRoles(c);
  }

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  c.addParent({
    name: 'MaticBridgedSuperToken',
    path: 'github.com/superfluid-finance/custom-supertokens/contracts/MaticBridgedSuperToken.sol',
  });

  c.addConstructorCode(`_initialize(factory, "${name}", "${symbol}");`);
}

function addPremint(c: ContractBuilder, receiver: string, initialSupply: number) {
  const amount = initialSupply.toString();
  const m = amount.match(premintPattern);
  if (m) {
    const integer = m[1]?.replace(/^0+/, '') ?? '';
    const decimals = m[2]?.replace(/0+$/, '') ?? '';
    const exponent = Number(m[3] ?? 0);

    if (Number(integer + decimals) > 0) {
      const decimalPlace = decimals.length - exponent;
      const zeroes = new Array(Math.max(0, -decimalPlace)).fill('0').join('');
      const units = integer + decimals + zeroes;
      const exp = decimalPlace <= 0 ? 'decimals()' : `(decimals() - ${decimalPlace})`;
      c.addConstructorCode(`_mint(msg.sender, ${units} * 10 ** ${exp});`);
    }
  }
}

function addMintable(c: ContractBuilder, receiver: string, amount: number) {
  c.addFunctionCode(`mint(${receiver}, ${amount})`, functions.mint);
}

function addOwnable(c: ContractBuilder) {
  c.addParent({
    name: 'Ownable',
    path: '@openzeppelin/contracts/access/Ownable.sol',
  });
  c.addModifier(`onlyOwner`, functions.mint);
}

function addRoles(c: ContractBuilder) {
  c.addVariable(`bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");`)
  c.addParent({
    name: 'AccessControl',
    path: '@openzeppelin/contracts/access/AccessControl.sol',
  });
  c.addModifier(`onlyRole(MINTER_ROLE)`, functions.mint);

  c.addConstructorCode(`_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);`);
  c.addConstructorCode(`_setupRole(MINTER_ROLE, msg.sender);`);
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