import { Center, Divider, Flex, Text } from "@mantine/core"
import { LicenseApplicationStepsBox } from "../StepsBox"
import { Account } from "viem"

type StepsDataProps = {
    walletAddress: string,
    firstPackedData: BigInt,
    secondPackedData: BigInt,
    licenseType: string,
    applicationHash: string,
    signature: string,
    licenseFee: string,
    royaltyFee: string,
}

export const StepsDataBox = ({
    walletAddress,
    firstPackedData,
    secondPackedData,
    licenseType,
    applicationHash,
    signature,
    licenseFee,
    royaltyFee,
}: StepsDataProps) => {
    return (
        <Flex p='md' gap='md' miw='45%' direction='column' sx={(theme) => ({
            border: '2px solid white',
            borderRadius: '10px'
        })}>
            <Center mb={20}><Text size={24}>TECHNICAL VARIABLE DATA</Text></Center>
            <Text size='md'>Wallet address: <Text span c='#42ca9f'>{walletAddress as string}</Text> </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>First packed data: <Text span c='#42ca9f'>{firstPackedData as unknown as string}</Text></Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>Second packed data: <Text span c='#42ca9f'>{secondPackedData as unknown as string}</Text> </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License type chosen: <Text span c='#42ca9f'>{licenseType}</Text> </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License application hash: <Text span c='#42ca9f'>{applicationHash}</Text> </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>Signature from app. hash: <Text span c='#42ca9f'>{signature}</Text> </Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>License fee: <Text span c='#42ca9f'>{licenseFee}</Text></Text>
            <Divider size='md' c='#42ca9f' />
            <Text size='md'>Royalty fee: <Text span c='#42ca9f'>{royaltyFee}</Text></Text>
            <Divider size='md' c='#42ca9f' />
        </Flex>
    )
}