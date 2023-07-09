import type { Contract } from '@superfluid-wizard/core';
import { ethers } from 'ethers';
import { BACKEND_URL } from './constants';

export interface CompileContractResponse {
  abi: string;
  bytecode: string;
  artifacts: Record<string, any>;
  success: boolean;
  error?: string;
}

export interface CompileContractProps {
  contractData: string;
  contractName: string;
}

export interface DeployContractProps {
  abi: Record<string, any> | string | any;
  bytecode: string;
  name: string | undefined;
}

export interface DeployContractResponse {
  contractAddress: string;
  success: boolean;
}

/**
 * `deployContract` deploys a contract to the currently selected blockchain (Ethereum, Polygon, etc.)
 * @param deployData contract data to deploy
 * @returns contractAddress
 */

export const deployContract = async (deployData: DeployContractProps) => {

  try {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be run in a web browser environment');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const response = await fetch(`${BACKEND_URL}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deployData)
    });

    console.log('deploy response', response);
    const resData = await response.json();

    const gasLimit = 6000000;
    // this brings up MM but tx fails
    const transactionRequest = { from: signer._address, data: resData.transactionData, gasLimit };
    const transactionResponse = await signer.sendTransaction(transactionRequest);

    await transactionResponse.wait(); // Wait for transaction to be mined

    const receipt = await provider.getTransactionReceipt(transactionResponse.hash);
    const contractAddress = receipt.contractAddress;
    console.log('contract deployed to', contractAddress);

    if (contractAddress) {
      return {
        contractAddress,
        success: true
      };
    } else {
      throw new Error('Deployment failed');
    }


  } catch (error: any) {
    console.error(error);
    console.log(error.message);
    return {
      contractAddress: '',
      success: false,
      error: error.message
    };
  }
}

/**
 * Reformats the Solidity code to be compatible with the Solidity compiler
 * @param code
 * @returns code with solidity version changed and import format changed
 */
export function adjustSolidityCode(code: string) {
  // Change the Solidity version
  code = code.replace(/^pragma solidity [^;]+;/m, 'pragma solidity ^0.8.0;');

  // Change the import format and replace github.com/ with @
  code = code.replace(/import "([^"]+)\/([^/]+)\.sol";/g, function(_, path, contractName) {
      // Replace 'github.com/' with '@' in the path
      path = path.replace('github.com/', '@');

      // Change the import to the requested format
      return `import { ${contractName} } from "${path}/${contractName}.sol";`;
  });

  // Replace all linebreaks with \n and " with '
  // code = code.replace(/\r?\n/g, '\\n').replace(/"/g, "'");

  return code;
}

/**
 * `compileContract` compiles a contract and returns the ABI and bytecode for later deployment
 * @param contractName
 * @param contractData
 * @returns {CompileContractResponse} { abi: string; bytecode: string;  success: boolean;  error?: string;}
 */
export const compileContract = async (compileData: CompileContractProps): Promise<CompileContractResponse> => {
  const { contractData, contractName } = compileData;
  console.log('compileContract() compileData...', { contractData, contractName });

  try {
    const reformattedContract = adjustSolidityCode(contractData)

    console.log('compileContract() replaced...', reformattedContract);

    // Send the contract name and data to your /compile endpoint at the backend
    const response = await fetch(`${BACKEND_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: contractName, code: reformattedContract })
    });

    const resData = await response.json();
    console.log('compileContract() resData...', resData);

    const { abi, bytecode, error:resError } = resData;

    const success = response.ok;

    if (success) {
      return {
        abi,
        bytecode,
        artifacts: resData,
        success
      };
    } else {
      throw new Error(resError);
    }



  } catch (error: any) {
    console.error('Compile error: ', error);
    return {
      abi: '',
      bytecode: '',
      artifacts: {},
      success: false,
      error: error.message
    };
  }
}
