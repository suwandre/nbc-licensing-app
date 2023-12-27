import { Badge, Button, Flex, Text, Tooltip } from '@mantine/core';
import { LicenseApplicationStepsBox } from '../StepsBox';
import { IconUserCheck } from '@tabler/icons';
import { useContext } from 'react';
import AuthContext from '@/components/Auth/AuthContext';

export const KYCVerification = () => {
    const { kycVerified } = useContext(AuthContext);
    return (
        <LicenseApplicationStepsBox marginTop={20}>
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
                    <IconUserCheck size={35} />
                    <Text
                        color={'white'}
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
                        3. Complete KYC Verification
                    </Text>
                </Flex>
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
                    KYC Portal
                </Button>
            </Flex>
        </LicenseApplicationStepsBox>
    )
}