import { Center, Divider, Flex, Text } from "@mantine/core"
import { LicenseApplicationStepsBox } from "../StepsBox"

type StepsDataProps = {
    walletAddress: string,
    firstPackedData: number,
    secondPackedData: number,
    licenseType: string,
    applicationHash: string,
    signature: string,
    licenseFee: number
}

export const StepsDataBox = ({
    walletAddress,
    firstPackedData,
    secondPackedData,
    licenseType,
    applicationHash,
    signature,
    licenseFee
}: StepsDataProps) => {
    return (
        <Flex p='md' gap='md' miw='45%' direction='column' sx={(theme) => ({
            border: '2px solid white',
            borderRadius: '10px'
        })}>
            <Center mb={20}><Text size={24}>TECHNICAL VARIABLE DATA</Text></Center>
            <Text size='md'>Wallet address: {walletAddress} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>First packed data: {firstPackedData} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>Second packed data: {secondPackedData} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License type chosen: {licenseType} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License application hash: {applicationHash} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>Signature from app. hash: {signature} </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License fee: {licenseFee} </Text>
            <Divider size='md' c='#42ca9f' />
        </Flex>
    )
}