import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";
import {
  dynamicContractRead,
  useDynamicPrepareContractWrite,
} from "@/utils/contractActions";
import { useContractWrite } from "wagmi";
import { Account } from "viem";
import { useEffect, useState } from "react";

type PayFeeStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  applicationHash: string;
};

export const PayFeeStep = ({
  sessionAddress,
  applicationHash,
}: PayFeeStepProps) => {
  const [paid, setPaid] = useState(false);

  // pay license fee and call
  const payLicenseFeeConfig = useDynamicPrepareContractWrite(
    "payLicenseFee",
    sessionAddress,
    [applicationHash],
    BigInt("30000000000000000")
  );

  const {
    data: payLicenseFeeData,
    error: payLicenseFeeError,
    isLoading: payLicenseFeeIsLoading,
    isSuccess: payLicenseFeeIsSuccess,
    write: payLicenseFeeWrite,
  } = useContractWrite(payLicenseFeeConfig);

  const checkPaid = async () => {
    const data = (await dynamicContractRead("isFeePaid", sessionAddress, [
      sessionAddress,
      applicationHash,
    ])) as boolean;

    if (data) {
      setPaid(true);
    }
  };

  useEffect(() => {
    checkPaid();
  }, [sessionAddress, applicationHash]);

  return (
    <LicenseApplicationStepsBox 
      marginTop={20}
      style={{ border: paid ? '2px solid #42ca9f' : '2px solid white' }}
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
          <IconWallet size={25} color={paid ? '#42ca9f' : 'white'} />
          <Text
            color={paid ? '#42ca9f' : 'white'}
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
            7. Pay license fee
          </Text>
          <Tooltip
            multiline
            width={350}
            label="Before the licensor approves your application, you are required to pay the license fee. For this example, it's 0.03 BNB."
          >
            <Badge
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
              })}
            >
              <p style={{ color: "white" }}>Info</p>
            </Badge>
          </Tooltip>
        </Flex>
        {paid ? (
          <IconCheck style={{ marginRight: 25 }} color="#42ca9f" />
        ) : (
          <Button
            sx={(theme) => ({
              backgroundColor: "#42ca9f",
              marginRight: 25,
              ":hover": {
                transform: "scale(1.01) translate(1px, -3px)",
                transitionDuration: "200ms",
                backgroundColor: "#42ca9f",
              },

              [theme.fn.smallerThan("sm")]: {
                fontSize: 10,
              },
            })}
            disabled={!payLicenseFeeWrite || payLicenseFeeIsLoading}
            onClick={() => payLicenseFeeWrite?.()}
            loading={payLicenseFeeIsLoading}
          >
            Pay
          </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
