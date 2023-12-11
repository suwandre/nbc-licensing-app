import { GetWalletClientResult } from '@wagmi/core';
import { useState } from 'react';
import { useWalletClient } from 'wagmi';

type SignMessageProps = {
    message: string
}

/**
 * Message signature hook, improvised from viem's `signMessage` function and an alternative of wagmi's `useSignMessage` hook.
 * 
 * Although wagmi has a `useSignMessage` hook, there seems to be an issue with the signature it returns, most likely
 * due to the `raw` property not being available within the `message` parameter.
 * 
 * Therefore, this `useSignMessage` hook acts as a replacement for wagmi's `useSignMessage` hook.
 */
export const useSignMessage = ({
    message
}: SignMessageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [signature, setSignature] = useState('');

    const { data: walletClient } = useWalletClient();

    const sign = async () => {
        try {
            setIsLoading(true);

            const getSign = await walletClient?.signMessage({
                account: walletClient.account,
                message: { raw: message as `0x${string}` }
            });

            setSignature(getSign ?? '');
            setIsLoading(false);
            setIsSuccess(true);
        } catch (err) {
            setIsError(true);
            setIsLoading(false);

            console.log('Error signing message: ', err);
        }
    }

    return { isLoading, isError, isSuccess, signature, sign };
}