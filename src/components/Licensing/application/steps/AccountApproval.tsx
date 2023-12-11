import { Badge, Flex, Text, Tooltip } from '@mantine/core';
import { LicenseApplicationStepsBox } from '../StepsBox';
import { IconCheck, IconChecks } from '@tabler/icons';
import { useDynamicContractRead } from '@/utils/contractActions';
import { useContext } from 'react';
import AuthContext from '@/components/Auth/AuthContext';
import { LicenseeAccountData } from '@/components/types/LicenseeAcount';

export const LiceseeAccountApproval = () => {
    const { sessionData } = useContext(AuthContext);
    const { data: getAccountData, error: getAccountError } = useDynamicContractRead(
        "getAccount",
        sessionData?.user?.address,
        [sessionData?.user?.address]
    ) as { data: LicenseeAccountData, error: Error | null };

    if (getAccountError) {
        console.log(getAccountError);
    }

    // if `usable` is true, it also basically means that the account is approved.
    const accountApproved = getAccountData?.data !== '0x' && getAccountData?.usable;

    return (
        <LicenseApplicationStepsBox
            marginTop={20}
            style={accountApproved ? { border: '2px solid #42ca9f' } : { border: '2px solid white' }}
        >
            <Flex
                direction='row'
                align='center'
                justify='space-between'
                sx={(theme) => ({
                    marginLeft: 15,
                })}
            >
                <Flex
                    direction='row'
                    align='center'
                >
                    <IconChecks size={35} color={accountApproved ? '#42ca9f' : undefined} />
                    <Text
                        color={accountApproved ? '#42ca9f' : 'white'}
                        sx={(theme) => ({
                            margin: '20px 10px 20px 25px',
                            fontSize: 20,
                            fontWeight: 500,

                            [theme.fn.smallerThan('sm')]: {
                                fontSize: 14,
                                margin: '20px 5px 20px 5px',
                            }
                        })}
                    >
                        2. Await account approval
                    </Text>
                    {!accountApproved && (
                        <Tooltip
                        label='The licensor is currently reviewing your account registration. Please wait.'
                    >
                        <Badge
                            sx={(theme) => ({
                                backgroundColor: '#42ca9f',
                            })}
                        >
                            <p style={{ color: 'white' }}>Info</p>
                        </Badge>
                    </Tooltip>
                    )}
                </Flex>
                {accountApproved && (
                    <IconCheck color='#42ca9f' style={{ marginRight: 25 }} />
                )}
            </Flex>
        </LicenseApplicationStepsBox>
    )
}