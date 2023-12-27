import { Flex, Text } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";

type ConnectWalletStepProps = {
    walletConnected: boolean
};

export const ConnectWalletStep = ({
    walletConnected
}: ConnectWalletStepProps) => {
  return (
    <LicenseApplicationStepsBox 
        marginTop={20}
        style={{border: walletConnected ? '2px solid #42ca9f' : '2px solid white'}}
    >
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        sx={(theme) => ({
          marginLeft: 15,
        })}
      >
        <Flex direction="row" align="center">
          <IconWallet size={25} color={walletConnected ? '#42ca9f' : 'white'} />
          <Text
            color={walletConnected ? '#42ca9f' : 'white'}
            sx={(theme) => ({
              margin: "10px 10px 10px 15px",
              fontSize: 16,
              fontWeight: 500,

              [theme.fn.smallerThan("sm")]: {
                fontSize: 14,
                margin: "20px 5px 20px 5px",
              },
            })}
          >
            1. Connect wallet
          </Text>
        </Flex>
        {walletConnected && <IconCheck style={{marginRight: 25}} color='#42ca9f' />}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
