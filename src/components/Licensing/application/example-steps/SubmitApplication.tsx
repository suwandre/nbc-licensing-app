import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";
import { useContractWrite } from "wagmi";
import {
  dynamicContractRead,
  useDynamicPrepareContractWrite,
} from "@/utils/contractActions";
import { Account } from "viem";
import { useEffect, useState } from "react";

type SubmitApplicationStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  licenseHash: string;
  firstPackedData: BigInt;
  secondPackedData: BigInt;
  signature: string;
  modifications: string;
  applicationHash: string;
};

type LicenseAgreementData = {
  licensee: string;
  id: number;
  data: object;
  signature: string;
  usable: boolean;
  feePaid: boolean;
  modifications: boolean;
};

export const SubmitApplicationStep = ({
  sessionAddress,
  licenseHash,
  firstPackedData,
  secondPackedData,
  signature,
  modifications,
  applicationHash,
}: SubmitApplicationStepProps) => {
  const [submitted, setSubmitted] = useState(false);

  const submitApplicationConfig = useDynamicPrepareContractWrite(
    "submitApplication",
    sessionAddress,
    [
      licenseHash,
      firstPackedData,
      secondPackedData,
      signature,
      modifications,
      // random hash salt string
      "hashsalttest",
    ],
    undefined
  );

  const {
    data: submitApplicationData,
    error: submitApplicationError,
    isLoading: submitApplicationIsLoading,
    isSuccess: submitApplicationIsSuccess,
    write: submitApplicationWrite,
  } = useContractWrite(submitApplicationConfig);

  useEffect(() => {
    const checkSubmitted = async () => {
      const data = (await dynamicContractRead(
        "getLicenseAgreement",
        sessionAddress,
        [sessionAddress, applicationHash]
      )) as LicenseAgreementData;

      // random check to see if the license agreement exists by querying any one of the fields.
      if (data && data.signature !== "0x") {
        setSubmitted(true);
      }
    };

    checkSubmitted();
  }, [
    sessionAddress,
    applicationHash,
    submitApplicationIsLoading,
    submitApplicationIsSuccess,
  ]);

  return (
    <LicenseApplicationStepsBox
      marginTop={20}
      style={{ border: submitted ? "2px solid #42ca9f" : "2px solid white" }}
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
          <IconWallet size={25} color={submitted ? "#42ca9f" : "white"} />
          <Text
            color={submitted ? "#42ca9f" : "white"}
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
            6. Submit license application
          </Text>
          <Tooltip
            multiline
            width={350}
            label="Submits your application with the license hash, first packed data, second packed data, signature from the previous step, an empty modification and a random salt string."
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
        {submitted ? (
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
            disabled={!submitApplicationWrite || submitApplicationIsLoading}
            onClick={() => submitApplicationWrite?.()}
            loading={submitApplicationIsLoading}
          >
            Submit
          </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
