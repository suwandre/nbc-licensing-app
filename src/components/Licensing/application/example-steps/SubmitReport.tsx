import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconArrowRightRhombus, IconCheck, IconWallet } from "@tabler/icons";
import { dynamicContractRead, useDynamicPrepareContractWrite } from "@/utils/contractActions";
import { useContractWrite } from "wagmi";
import { Account } from "viem";
import { useEffect, useState } from "react";

type SubmitReportStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  applicationHash: string;  
}

type ReportData = {
  amountDue: number;
  url: string;
  packedData: number;
}

export const SubmitReportStep = ({
  sessionAddress,
  applicationHash
}: SubmitReportStepProps) => {
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // submit report config and call
  const reportConfig = useDynamicPrepareContractWrite(
    "submitReport",
    sessionAddress,
    [sessionAddress, applicationHash, "https://url.com"],
    undefined
  );

  const {
    data: reportData,
    error: reportError,
    isLoading: reportIsLoading,
    isSuccess: reportIsSuccess,
    write: reportWrite,
  } = useContractWrite(reportConfig);

  useEffect(() => {
    const getReport = async () => {
      const data = (await dynamicContractRead(
        'getReport',
        sessionAddress,
        [
          sessionAddress,
          applicationHash,
          // we get the 0th index since we only will submit/have submitted one report
          0
        ]
      )) as ReportData;

      // random check to see if report exists
      if (data && data.amountDue !== 0) {
        setReportSubmitted(true);
      }
    }

    getReport();
  }, [sessionAddress, applicationHash])

    return (
        <LicenseApplicationStepsBox 
          marginTop={20}
          style={{ border: reportSubmitted || reportIsSuccess ? "2px solid #42ca9f" : "2px solid white" }}
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
              <IconArrowRightRhombus size={25} color={reportSubmitted || reportIsSuccess ? "#42ca9f" : "white"} />
              <Text
                color={reportSubmitted || reportIsSuccess ? "#42ca9f" : "white"}
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
                9. Submit report
              </Text>
              <Tooltip
                multiline
                width={350}
                label="Submit a test report for this license. Can only be called when a report is due."
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
            {reportSubmitted || reportIsSuccess ? (
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
              disabled={!reportWrite || reportIsLoading}
              onClick={() => reportWrite?.()}
              loading={reportIsLoading}
            >
              Submit
            </Button>
            )}
          </Flex>
        </LicenseApplicationStepsBox>
      );
}