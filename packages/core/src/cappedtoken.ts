import { CommonOptions, defaults as commonDefaults, withCommonDefaults } from './common-options';
import { BaseFunction, Contract, ContractBuilder } from './contract';
import { printContract } from './print';
import { setInfo } from './set-info';
// import { premintPattern } from '@openzeppelin/wizard';

export interface CappedSuperTokenOptions extends CommonOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  maxSupply: number;
  receiver: string;
  mintable: boolean;
  burnable: boolean;
  capped: boolean;
  ownable: boolean;
  maticBridge: boolean;
}

export const cappedSuperTokenDefaults: Required<CappedSuperTokenOptions> = {
  name: 'MyToken',
  symbol: 'MTK',
  initialSupply: 19,
  maxSupply: 100,
  receiver: '0x1A6784925814a13334190Fd249ae0333B90b6443',
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
  mintable: false,
  burnable: false,
  capped: false,
  ownable: false,
  maticBridge: false,
} as const;

function withDefaults(opts: CappedSuperTokenOptions): Required<CappedSuperTokenOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    initialSupply: opts.initialSupply ?? cappedSuperTokenDefaults.initialSupply,
    receiver: opts.receiver || cappedSuperTokenDefaults.receiver,
  };
}

export function printCappedSuperToken(opts: CappedSuperTokenOptions = cappedSuperTokenDefaults): string {
  return printContract(buildCappedSuperToken(opts));
}

export function buildCappedSuperToken(opts: CappedSuperTokenOptions): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { access, info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol, allOpts.maxSupply);

  if (allOpts.initialSupply > 0) {
    addPremint(c, allOpts.receiver, allOpts.initialSupply);
  }

  setInfo(c, info);

  if (allOpts.mintable) {
    addMintable(c, allOpts.receiver, allOpts.initialSupply, allOpts.maxSupply);
  }

  if (access === 'ownable') {
    addOwnable(c);
  }

  if (access === 'roles') {
    addRoles(c);
  }


  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string, maxSupply: number) {
  c.addParent({
    name: 'CappedSuperToken',
    path: 'github.com/superfluid-finance/custom-supertokens/contracts/CappedSuperToken.sol',
  });

  c.addOverride(`_initialize(factory, "${name}", "${symbol}");`, functions.initialize);
  c.addFunctionCode(`maxSupply = ${maxSupply};`, functions.initialize);
}

// function formatAmount(amount: number) {
//   const m = amount.toString().match(premintPattern);
//   let result = ''

//   if (m) {
//     const integer = m[1]?.replace(/^0+/, '') ?? '';
//     const decimals = m[2]?.replace(/0+$/, '') ?? '';
//     const exponent = Number(m[3] ?? 0);

//     if (Number(integer + decimals) > 0) {
//       const decimalPlace = decimals.length - exponent;
//       const zeroes = new Array(Math.max(0, -decimalPlace)).fill('0').join('');
//       const units = integer + decimals + zeroes;
//       const exp = decimalPlace <= 0 ? 'decimals()' : `(decimals() - ${decimalPlace})`;
//       result =  `${units} * 10 ** ${exp}`;
//     }
//   }
//   return result;
// }

export const premintPattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;

function addPremint(c: ContractBuilder, receiver: string, initialSupply: number) {
  // const amount = formatAmount(initialSupply);
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
      const exp = decimalPlace <= 0 ? '18' : `(18 - ${decimalPlace})`;
      c.addConstructorCode(`_mint(msg.sender, ${units} * 10 ** ${exp});`);
    }
  }
}

function addOwnable(c: ContractBuilder) {
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

function addMintable(c: ContractBuilder, receiver: string, amount: number, maxSupply: number) {
  // const preminted = formatAmount(amount);
  c.addFunctionCode(`if (_totalSupply() + ${amount} > ${maxSupply}) revert SupplyCapped();\n`, functions.mint);
  c.addFunctionCode(`_mint(${receiver}, ${amount}, userData);`, functions.mint);
}


//wtf
export const functions = {
  initialize: {
    kind: 'external' as const,
    name: 'initialize',
    args: [
      { name: 'factory', type: 'address' },
      { name: 'name', type: 'string memory' },
      { name: 'symbol', type: 'string memory' },
      { name: '_maxSupply', type: 'uint256' },
    ],
  },
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
      { name: 'userData', type: 'bytes memory' },
    ]
  },
  burn: {
    kind: 'external' as const,
    name: 'burn',
    args: [
      { name: 'amount', type: 'uint256' },
      { name: 'userData', type: 'bytes memory' },
    ]
  }
};