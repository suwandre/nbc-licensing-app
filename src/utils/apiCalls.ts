import { ApiResponse } from '@/components/types/ApiResponse';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Account } from 'viem';

/**
 * Creates a user account and a new session in the database for the user.
 */
export const createUser = async (
    walletAddress: string,
    expirationDate: number,
    chainId: number,
    domain: string,
    nonce: string,
    signature: string,
    payload: string | null,
    profileId: string,
    uri: string,
    version: number,
) => {
    const config: AxiosRequestConfig = {
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user/create-user`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "wallet_address": walletAddress.toLowerCase(),
            "expiration_date": expirationDate,
            "chain_id": chainId,
            domain,
            "nonce": nonce,
            "signature": signature,
            payload,
            "profile_id": profileId,
            "uri": uri,
            "version": version,
        }
    }

    const response = await axios(config).catch((err: any) => {
        return console.error("err here lol: ", err);
    }) as AxiosResponse<ApiResponse>;

    console.log('response: ', response?.data?.data);
    return response?.data?.data;
}