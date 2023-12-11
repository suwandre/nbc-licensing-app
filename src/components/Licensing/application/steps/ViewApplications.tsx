import { Button, Flex, Text } from '@mantine/core';
import { LicenseApplicationStepsBox } from '../StepsBox';
import { IconArrowDown, IconArrowUp, IconPaperclip } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';

export const ViewApplications = () => {
    const [opened, {toggle}] = useDisclosure(false);
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
                    <IconPaperclip size={35} />
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
                        5. View your applications
                    </Text>
                </Flex>
                <Button
                    onClick={toggle}
                    sx={(theme) => ({
                        backgroundColor: 'transparent',
                        ':hover': {
                            backgroundColor: 'transparent'
                        }
                    })}
                >
                    {opened ? <IconArrowUp /> : <IconArrowDown />}
                </Button>
            </Flex>
        </LicenseApplicationStepsBox>
    )
}