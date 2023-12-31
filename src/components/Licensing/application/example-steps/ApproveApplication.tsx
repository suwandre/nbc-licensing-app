import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconWallet } from "@tabler/icons";
import { Account } from "viem";
import { useEffect, useState } from "react";
import { dynamicContractRead } from "@/utils/contractActions";

type ApproveApplicationStepProps = {
  sessionAddress: `0x${string}` | Account | undefined;
  applicationHash: string;
};

export const ApproveApplicationStep = ({
  sessionAddress,
  applicationHash,
}: ApproveApplicationStepProps) => {
  const [approved, setApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveApplication = async () => {
    // if already approved, return
    if (approved) return;

    console.log("approving application...");

    setIsLoading(true);

    try {
      const res = await fetch("/api/contract/approveApplication", {
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

      console.log("data for approve application: ", data);

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
    // check if license is usable (i.e. approved)
    const checkUsable = async () => {
      const data = (await dynamicContractRead(
        "isLicenseUsable",
        sessionAddress,
        [sessionAddress, applicationHash]
      )) as boolean;

      if (data) {
        setApproved(true);
      }
    };

    checkUsable();
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
          <IconWallet size={25} color={approved ? "#42ca9f" : "white"} />
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
            8. Approve application
          </Text>
          <Tooltip
            multiline
            width={350}
            label="Normally, the licensor will decide to approve or reject your application. For this example, we will manaully approve your application."
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
            onClick={approveApplication}
            disabled={approved || isLoading}
            loading={isLoading}
          >
            Approve
          </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
