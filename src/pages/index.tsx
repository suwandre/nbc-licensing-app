import { Layout } from '@/components/Layout/Layout';
import { DefaultSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import licenseABI from '@/abis/License.json';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Button } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { toBytes, toHex } from 'viem';
import { dynamicContractRead, useDynamicContractWrite, useDynamicPrepareContractWrite } from '@/utils/contractActions';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import AuthContext from '@/components/Auth/AuthContext';
import { readContract } from '@wagmi/core';

export default function Home() {
  const { address: accountAddress } = useAccount();
  
  const { sessionData } = useContext(AuthContext);

  // session address MAY differ than `accountAddress` from `useAccount()`; session address is to be used for all purposes.
  const sessionAddress = sessionData?.user?.address;

  const convertToBytes = toHex(
    `${sessionData?.user?.address}|Test Name|25 January 2000|12 Test Road, NY 12211, USA|test@gmail.com|+1123123123|None|USA|USA`
  );

  const registerAccountConfig = useDynamicPrepareContractWrite(
    'registerAccount',
    sessionAddress,
    [convertToBytes]
  );

  const {
    data: registerAccountData,
    error: registerAccountError,
    isLoading: registerAccountIsLoading,
    isSuccess: registerAccountIsSuccess,
    write: registerAccountWrite,
  } = useContractWrite(registerAccountConfig);

  // use effect to call `getAccount` whenever `sessionAddress` changes.
  useEffect(() => {
    const getAccount = async () => {
      const data = await dynamicContractRead(
        'getAccount',
        sessionAddress,
        [sessionAddress]
      );

      console.log('get account data: ', data);
    }

    getAccount();
  }, [sessionAddress]);

  return (
    <>
      <Layout
        pageTitle='Licensing'
      >
        <Button sx={(theme) => ({
          backgroundColor: '#42ca9f',
          transitionDuration: '200ms',
          ':hover': {
            transform: 'scale(1.01) translate(1px, -3px)',
            backgroundColor: '#42ca9f',
          },
      
          ':active': {
            transform: 'translateY(2px)',
          },
        })}
          disabled={!registerAccountWrite || registerAccountIsLoading}
          onClick={() => registerAccountWrite?.()}
        >
          Create Account
        </Button>
        <p>Wagmi account address: {accountAddress}</p>
        <p>Session address: {sessionAddress as string}</p>
      </Layout>
    </>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (!session) {
//     console.log('no session found');
//   }

//   console.log('session: ', session);

//   return {
//     props: {
//       session: session as CustomSessionType | null,
//     }
//   }
// }
