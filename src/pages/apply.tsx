import { Layout } from '@/components/Layout/Layout';
import { LicenseApplicationStepsBox } from '@/components/Licensing/application/StepsBox';
import { LiceseeAccountApproval } from '@/components/Licensing/application/steps/AccountApproval';
import { KYCVerification } from '@/components/Licensing/application/steps/KYCVerification';
import { LicenseApplication } from '@/components/Licensing/application/steps/LicenseApplication';
import { RegisterLicenseeAccount } from '@/components/Licensing/application/steps/RegisterAccount';
import { ViewApplications } from '@/components/Licensing/application/steps/ViewApplications';
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
                <RegisterLicenseeAccount />
                <LiceseeAccountApproval />
                <KYCVerification />
                <LicenseApplication />
                <ViewApplications />
            </Flex>
        </Layout>
    );
}

export default Apply;