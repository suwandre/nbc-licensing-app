import { Layout } from '@/components/Layout/Layout';
import { Flex } from '@mantine/core';
import { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

type HomeProps = {
  user: DefaultSession['user'];
}

export default function Home({user}: HomeProps) {
  const { isConnecting, isConnected, connector, isReconnecting, isDisconnected, address } = useAccount();
  return (
    <>
      <Layout
        pageTitle='Licensing'
      >
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    console.log('no session found');
  }

  console.log('session: ', session);

  return {
    props: {
      user: session?.user ?? '',
    }
  }
}
