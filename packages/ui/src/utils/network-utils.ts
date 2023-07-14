import { NETWORK_CONTRACTS_MAP, NetworkId } from "./constants";
import { switchNetwork } from "@wagmi/core";
/**
 * Takes a chainId and returns the network data including the network name and the factory contract address
 * @param chainId
 * @returns network data
 */
const getNetworkData = (chainId: NetworkId) => {
  return NETWORK_CONTRACTS_MAP[chainId] || { name: 'Unknown Network', contract: 'No Contract Found for Network' };
};

const changeNetwork = async (chainId: number) => {
  const network = await switchNetwork({ chainId });
  return network;
};

const shortenAddress = (address: string, gap: number) => {
  return `${address.slice(0, 6)}...${address.slice(-gap)}`;
};

export {
  getNetworkData,
  changeNetwork,
  shortenAddress
}