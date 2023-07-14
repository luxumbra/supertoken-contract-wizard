import { NETWORK_CONTRACTS_MAP, NetworkId } from "./constants";
import { switchNetwork } from "@wagmi/core";
/**
 * Takes a chainId and returns the network data including the network name and the factory contract address
 * @param chainId
 * @returns network data
 */
const getNetworkData = (chainId: NetworkId | number) => {
  return NETWORK_CONTRACTS_MAP[chainId] || {
    name: 'Unknown Network',
    contract: 'No Contract Found for Network',
    blockExplorer: 'https://etherscan.io'
  };
};

const changeNetwork = async (chainId: number) => {
  const network = await switchNetwork({ chainId });
  return network;
};

const shortenAddress = (address: string | undefined, gap = 6) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-gap)}`;
};

export {
  getNetworkData,
  changeNetwork,
  shortenAddress
}