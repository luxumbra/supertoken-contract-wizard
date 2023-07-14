declare global {
  interface Window { ethereum: any; }
  type NetworkMap = {
    [key in NetworkId]: string;
  };

  type FactoryContractMap = {
    [key in NetworkId]: string;
  };

  type NetworkContractsMap = {
    [key in NetworkId]: {
      name: NetworkMap[key];
      contract: FactoryContractMap[key];
      blockExplorer: string;
    };
  };
}

export {
  NetworkMap,
  FactoryContractMap,
  NetworkContractsMap,
};

