const BACKEND_URL = 'http://localhost:3000';

enum NetworkId {
  Mainnet = 1,
  GnosisChain = 100,
  Polygon = 137,
}

const NETWORK_MAP: NetworkMap = {
  [NetworkId.Mainnet]: 'Mainnet',
  [NetworkId.GnosisChain]: 'Gnosis Chain',
  [NetworkId.Polygon]: 'Polygon',
};

const FACTORY_CONTRACT_MAP: FactoryContractMap = {
  [NetworkId.Mainnet]: '0x0422689cc4087b6B7280e0a7e7F655200ec86Ae1',
  [NetworkId.GnosisChain]: '0x23410e2659380784498509698ed70E414D384880',
  [NetworkId.Polygon]: '0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34',
};

const NETWORK_CONTRACTS_MAP: NetworkContractsMap = {
  [NetworkId.Mainnet]: {
    name: NETWORK_MAP[NetworkId.Mainnet]!,
    contract: FACTORY_CONTRACT_MAP[NetworkId.Mainnet]!,
  },
  [NetworkId.GnosisChain]: {
    name: NETWORK_MAP[NetworkId.GnosisChain]!,
    contract: FACTORY_CONTRACT_MAP[NetworkId.GnosisChain]!,
  },
  [NetworkId.Polygon]: {
    name: NETWORK_MAP[NetworkId.Polygon]!,
    contract: FACTORY_CONTRACT_MAP[NetworkId.Polygon]!,
  },
};

export {
  BACKEND_URL,
  NETWORK_MAP,
  FACTORY_CONTRACT_MAP,
  NETWORK_CONTRACTS_MAP,
  NetworkId,
}