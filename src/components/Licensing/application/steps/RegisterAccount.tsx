import { Button, Flex, Text } from '@mantine/core';
import { LicenseApplicationStepsBox } from '../StepsBox';
import { IconCheck, IconLogin } from '@tabler/icons';
import { useDynamicContractRead } from '@/utils/contractActions';
import { useContext } from 'react';
import AuthContext from '@/components/Auth/AuthContext';
import { LicenseeAccountData } from '@/components/types/LicenseeAcount';


export const RegisterLicenseeAccount = () => {
    const { sessionData } = useContext(AuthContext);
    const { data: getAccountData, error: getAccountError } =  useDynamicContractRead(
        "getAccount",
        sessionData?.user?.address,
        [sessionData?.user?.address]
    ) as { data: LicenseeAccountData, error: Error | null };

    if (getAccountError) {
        console.log(getAccountError);
    }

    // checks if account data exists (if the user has registered for a license account); i.e. data !== `0x`.
    const hasAccountData = getAccountData?.data !== '0x';

    return (
        <LicenseApplicationStepsBox
            style={hasAccountData ? { border: '2px solid #42ca9f'} : { border: '2px solid white'} }
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
                    <IconLogin size={35} color={hasAccountData ? '#42ca9f' : undefined} />
                    <Text
                        color={hasAccountData ? '#42ca9f' : 'white'}
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
                        1. Register for a licensee account
                    </Text>
                </Flex>
                {hasAccountData ? (
                    <IconCheck color='#42ca9f' style={{marginRight: 25}} />
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
                        }
                    })}
                >
                    Register
                </Button>
                )}
            </Flex>
        </LicenseApplicationStepsBox>
    )
}