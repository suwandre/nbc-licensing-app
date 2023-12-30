import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";
import { useSignMessage } from "@/utils/signMessage";
import { useEffect } from "react";

type SignApplicationStepProps = {
  applicationHash: string,
  // signature and setSignature are from 'index.tsx'.
  signature: string,
  setSignature: (signature: string) => void
}

export const SignApplicationStep = ({
  applicationHash,
  signature,
  setSignature
}: SignApplicationStepProps) => {
  const {
    isLoading: signMessageIsLoading,
    isError: signMessageError,
    isSuccess: signMessageIsSuccess,
    signature: signMessageSignature,
    sign: signFunction,
  } = useSignMessage({
    message: applicationHash
  });

  useEffect(() => {
    console.log('is signature success: ', signMessageIsSuccess);
    if (signMessageIsSuccess) {
      setSignature((signMessageSignature as string | undefined) ?? '');
    }
  }, [signMessageIsSuccess, signMessageSignature, setSignature]);

  // essentially a check wrapper to see if signature is not empty.
  const hasSignature = signature !== '';
    return (
        <LicenseApplicationStepsBox 
          marginTop={20}
          style={{ border: hasSignature ? '2px solid #42ca9f' : '2px solid white' }}
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
              <IconWallet size={25} color={hasSignature ? '#42ca9f' : 'white'} />
              <Text
                color={hasSignature ? "#42ca9f" : "white"}
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
                5. Sign application hash
              </Text>
              <Tooltip
                multiline
                width={350}
                label="All your data so far will be compiled into a hash string. 
                When you click 'Sign', a popup will appear on your wallet. Please sign it."
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
            {signature !== '' ? (
              <IconCheck style={{ marginRight: 25 }} color='#42ca9f' />
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
              onClick={signFunction}
              disabled={signMessageIsLoading || !applicationHash}
              loading={signMessageIsLoading}
            >
              Sign
            </Button>
            )}
          </Flex>
        </LicenseApplicationStepsBox>
      );
}