import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";
import { dynamicContractRead, useDynamicPrepareContractWrite } from "@/utils/contractActions";
import { useContractWrite } from "wagmi";
import { Account } from "viem";
import { useEffect, useState } from "react";

type PayRoyaltyStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  applicationHash: string;
}

export const PayRoyaltyStep = ({
  sessionAddress,
  applicationHash,
}: PayRoyaltyStepProps) => {
  const [paid, setPaid] = useState(false);

  // pay royalty config and call
  const payRoyaltyConfig = useDynamicPrepareContractWrite(
    "payRoyalty",
    sessionAddress,
    [applicationHash, BigInt(0), BigInt("30000000000000000")],
    BigInt("30000000000000000")
  );

  const {
    data: payRoyaltyData,
    error: payRoyaltyError,
    isLoading: payRoyaltyIsLoading,
    isSuccess: payRoyaltyIsSuccess,
    write: payRoyaltyWrite,
  } = useContractWrite(payRoyaltyConfig);

  useEffect(() => {
    const checkPaid = async () => {
      const data = (await dynamicContractRead(
        'getRoyaltyPaymentTimestamp',
        sessionAddress,
        [
          sessionAddress,
          applicationHash,
          // we get the 0th index since we only will submit/have submitted one report
          0
        ]
      )) as BigInt;

      if (data !== BigInt(0)) {
        setPaid(true);
      } else {
        setPaid(false);
      }
    }

    checkPaid();
  }, [sessionAddress, applicationHash])

    return (
        <LicenseApplicationStepsBox 
          marginTop={20}
          style={{ border: paid || payRoyaltyIsSuccess ? "2px solid #42ca9f" : "2px solid white" }}
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
              <IconWallet size={25} color={paid || payRoyaltyIsSuccess ? "#42ca9f" : "white"} />
              <Text
                color={paid || payRoyaltyIsSuccess ? "#42ca9f" : "white"}
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
                11. Pay royalty fee
              </Text>
              <Tooltip
                multiline
                width={350}
                label="Pays the royalty based on the previous report. For this example, it's 0.03 BNB."
              >
                <Badge
                  sx={(theme) => ({
                    backgroundColor: '#42ca9f',
                  })}
                >
                  <p style={{ color: 'white' }}>Info</p>
                </Badge>
              </Tooltip>
            </Flex>
            {paid || payRoyaltyIsSuccess ? (
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
              disabled={!payRoyaltyWrite || payRoyaltyIsLoading}
              onClick={() => payRoyaltyWrite?.()}
              loading={payRoyaltyIsLoading}
            >
              Pay
            </Button>
            )}
          </Flex>
        </LicenseApplicationStepsBox>
      );
}