import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconFileCheck, IconWallet } from "@tabler/icons";
import { Account } from "viem";
import { useEffect, useState } from "react";
import { dynamicContractRead } from "@/utils/contractActions";

type ApproveReportStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  applicationHash: string;
};

export const ApproveReportStep = ({
  sessionAddress,
  applicationHash,
}: ApproveReportStepProps) => {
  const [approved, setApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveReport = async () => {
    // if already approved, return
    if (approved) return;

    console.log("approving report...");

    setIsLoading(true);

    try {
      const res = await fetch("/api/contract/approveReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseeAddress: sessionAddress,
          applicationHash,
        }),
      });

      const data = await res.json();

      console.log("data for approve report: ", data);

      if (data.success) {
        setApproved(true);
        console.log("tx receipt: ", data.receipt);
      } else {
        console.log("error: ", data.error);
      }
    } catch (e: any) {
      console.log("error: ", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // check if report is approved
    const checkApproved = async () => {
      const data = (await dynamicContractRead(
        "getReportApprovalTimestamp",
        sessionAddress,
        [
          sessionAddress,
          applicationHash,
          // we get the 0th index since we only will submit/have submitted one report
          0,
        ]
      )) as BigInt;

      if (data !== BigInt(0)) {
        setApproved(true);
      // temporary add since report sometimes is approved
      } else {
        setApproved(false);
      }
    };

    checkApproved();
  }, [sessionAddress, applicationHash]);

  return (
    <LicenseApplicationStepsBox
      marginTop={20}
      style={{ border: approved ? "2px solid #42ca9f" : "2px solid white" }}
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
          <IconFileCheck size={25} color={approved ? "#42ca9f" : "white"} />
          <Text
            color={approved ? "#42ca9f" : "white"}
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
            10. Approve report
          </Text>
          <Tooltip
            multiline
            width={350}
            label="Approves the report submitted from Step 9. Normally, the licensor will be the one to approve a report."
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
        {approved ? (
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
            onClick={approveReport}
            disabled={isLoading || approved}
            loading={isLoading}
          >
            Approve
          </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
