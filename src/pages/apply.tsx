import { Layout } from '@/components/Layout/Layout';
import { Badge, Box, Button, Center, Flex, Text, Title, Tooltip } from '@mantine/core';
import { IconBrandTwitter } from '@tabler/icons';

const Apply = () => {
    return (
        <Layout
            pageTitle='Apply'
        >
            <Flex
                mt={50}
                direction='column'
                align='center'
                w='100%'
            >
                <Title
                    size={56}
                    sx={(theme) => ({
                        color: '#42ca9f',
                        lineHeight: 1,
                        [theme.fn.smallerThan('md')]: {
                            fontSize: 40
                        }
                    })}
                >
                    LICENSE APPLICATION
                </Title>
                <Text
                    align='center'
                    mt={20}
                    size={24}
                    sx={(theme) => ({
                        lineHeight: 1.3,
                        [theme.fn.smallerThan('md')]: {
                            fontSize: 18
                        }
                    
                    })}
                >
                    From borrowing assets to creating your own within our ecosystem,
                    <br />apply for an NBC license now!
                </Text>
                <Box
                    style={{ border: '2px solid white' }}
                    sx={(theme) => ({
                        marginTop: 45,
                        borderRadius: theme.radius.md,
                        width: '75%',
                        textAlign: 'center',
                        // marginBottom: getMarginBottom,
                        // marginTop: getMarginTop,
                    })}
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
                            <IconBrandTwitter size={35} />
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
                                Register for a licensee account
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
                            Register
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Layout>
    );
}

export default Apply;