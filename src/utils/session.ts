import { Account } from 'viem';

export type CustomSessionType = {
    expires: string;
    user?: SessionUser;
}

export type SessionUser = {
    address?: `0x${string}` | Account;
    chainId?: number;
    domain?: string;
    id?: string;
    nonce?: string;
    payload?: any;
    profileId?: string;
    uri?: string;
    version?: string;
}