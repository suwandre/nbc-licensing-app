import { Flex, Text } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconWallet } from "@tabler/icons";

export const ConnectWalletStep = () => {
  return (
    <LicenseApplicationStepsBox marginTop={20}>
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        sx={(theme) => ({
          marginLeft: 15,
        })}
      >
        <Flex direction="row" align="center">
          <IconWallet size={25} />
          <Text
            color={"white"}
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
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
