import { Badge, Button, Flex, Text, Tooltip } from '@mantine/core';
import { LicenseApplicationStepsBox } from '../StepsBox';
import { IconCheck, IconWallet } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { CustomSessionType } from '@/utils/session';
import { dynamicContractRead, useDynamicContractRead } from '@/utils/contractActions';
import { LicenseeAccountData } from '@/components/types/LicenseeAcount';

type ApproveAccountStepProps = {
  sessionData: CustomSessionType | null;
};

export const ApproveAccountStep = ({sessionData}: ApproveAccountStepProps) => {
  const [approved, setApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveAccount = async () => {
    // if already approved, return.
    if (approved) return;

    console.log('approving account...');

    setIsLoading(true);

    try {
      const res = await fetch('/api/contract/approveAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseeAddress: sessionData?.user?.address
        })
      });

      const data = await res.json();

      console.log('data for approve account: ', data);

      if (data.success) {
        setApproved(true);
        console.log('tx receipt: ', data.receipt);
      } else {
        console.log('error: ', data.error);
      }
    } catch (e: any) {
      console.log('error: ', e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const getAccount = async () => {
      const data = (await dynamicContractRead(
        'getAccount',
        sessionData?.user?.address,
        [
          sessionData?.user?.address
        ]
      )) as LicenseeAccountData;

      if (data && data.usable === true) {
        setApproved(true);
      }
    }
    getAccount();
  }, [sessionData?.user?.address]);

  return (
    <LicenseApplicationStepsBox 
      marginTop={20}
      style={{ border: approved ? '2px solid #42ca9f' : '2px solid white' }}
    >
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        sx={(theme) => ({
          marginLeft: 15,
        })}
      >
        <Flex direction='row' align='center'>
          <IconWallet size={25} color={approved ? '#42ca9f' : 'white'} />
          <Text
            color={approved ? '#42ca9f' : 'white'}
            sx={(theme) => ({
              margin: '10px 10px 10px 15px',
              fontSize: 16,
              fontWeight: 500,

              [theme.fn.smallerThan('sm')]: {
                fontSize: 14,
                margin: '20px 5px 20px 5px',
              },
            })}
          >
            3. Approve account registration
          </Text>
          <Tooltip
            multiline
            width={350}
            label='Normally, the licensor needs to approve your registration. For this example, you will manually approve your own registration.'
          >
            <Badge
              sx={(theme) => ({
                backgroundColor: '#42ca9f',
              })}
            >
              <p style={{ color: 'white' }}>Info</p>
            </Badge>
          </Tooltip>
        </Flex>
        {approved ? (
          <IconCheck style={{ marginRight: 25 }} color='#42ca9f' />
        ) : (
          <Button
          sx={(theme) => ({
            backgroundColor: '#42ca9f',
            marginRight: 25,
            ':hover': {
              transform: 'scale(1.01) translate(1px, -3px)',
              transitionDuration: '200ms',
              backgroundColor: '#42ca9f',
            },

            [theme.fn.smallerThan('sm')]: {
              fontSize: 10,
            },
          })}
          onClick={approveAccount}
          disabled={approved || isLoading}
          onError={() => {
            setError('Error approving account');
            console.error(error);
          }}
          loading={isLoading}
        >
          Approve
        </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
