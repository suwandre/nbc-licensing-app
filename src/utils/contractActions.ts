import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import licenseABI from '@/abis/License.json';
import { Account } from 'viem';
import { readContract, writeContract, prepareWriteContract, PrepareWriteContractResult } from '@wagmi/core';

const LICENSE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LICENSE_CONTRACT_ADDRESS_NO_PREFIX ?? '';

/**
 * Initializes a prepare contract write hook for the License contract.
 */
export const useDynamicPrepareContractWrite = (
    functionName: string,
    account: `0x${string}` | Account | undefined,
    args: readonly unknown[] | undefined
) => {
    const { config } = usePrepareContractWrite({
        address: '0x9A947b7d642e79A50313e5f9c9551dF6d4463261',
        account,
        abi: licenseABI,
        functionName,
        args,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
    });

    return config;
}

/**
 * Initializes a contract read for the License contract. 
 */
export const dynamicContractRead = async (
    functionName: string,
    // account that will call the function.
    account: `0x${string}` | Account | undefined,
    args: readonly unknown[] | undefined
) => {
    const data = await readContract({
        address: '0x9A947b7d642e79A50313e5f9c9551dF6d4463261',
        account,
        abi: licenseABI,
        functionName,
        args,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
    });

    return data;
}