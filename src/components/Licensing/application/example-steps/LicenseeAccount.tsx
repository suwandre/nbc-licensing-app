import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconCheck, IconFileArrowRight, IconRegistered } from "@tabler/icons";
import { CustomSessionType } from "@/utils/session";
import { useContractWrite } from "wagmi";
import {
  dynamicContractRead,
  useDynamicPrepareContractWrite,
} from "@/utils/contractActions";
import { toHex } from "viem";
import { useEffect, useState } from "react";

type LicenseeAccountStepProps = {
  // registerAccountWrite: (() => void) | undefined,
  // registerAccountIsLoading: boolean,
  sessionData: CustomSessionType | null;
};

type LicenseeAccountData = {
  data: string;
  usable: boolean;
};

export const LicenseeAccountStep = ({
  // registerAccountWrite,
  // registerAccountIsLoading,
  sessionData,
}: LicenseeAccountStepProps) => {
  const convertToBytes = toHex(
    `${sessionData?.user?.address}|Test Name|25 January 2000|12 Test Road, NY 12211, USA|test@gmail.com|+1123123123|None|USA|USA`
  );

  const registerAccountConfig = useDynamicPrepareContractWrite(
    'registerAccount',
    sessionData?.user?.address,
    [convertToBytes],
    undefined
  );

  const {
    data: registerAccountData,
    error: registerAccountError,
    isLoading: registerAccountIsLoading,
    isSuccess: registerAccountIsSuccess,
    write: registerAccountWrite,
  } = useContractWrite(registerAccountConfig);

  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    const checkAccountRegistered = async () => {
      const data = (await dynamicContractRead(
        "getAccount",
        sessionData?.user?.address,
        [sessionData?.user?.address]
      )) as LicenseeAccountData;

      if (data && data.data !== "0x") {
        setHasAccount(true);
      }
    };

    checkAccountRegistered();
  }, [sessionData?.user?.address]);

  return (
    <LicenseApplicationStepsBox
      marginTop={20}
      style={{ border: hasAccount || registerAccountIsSuccess ? "2px solid #42ca9f" : "2px solid white" }}
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
          <IconRegistered size={25} color={hasAccount || registerAccountIsSuccess ? "#42ca9f" : "white"} />
          <Text
            color={hasAccount || registerAccountIsSuccess ? "#42ca9f" : "white"}
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
            2. Register licensee account
          </Text>
          <Tooltip
            multiline
            width={350}
            label={`Creates your licensee account with the following data parameters: ${sessionData?.user?.address}|Test Name|25 January 2000|12 Test Road, NY 12211, USA|test@gmail.com|+1123123123|None|USA|USA. For more information, please refer to our documentation.`}
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
        {hasAccount || registerAccountIsSuccess ? (
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
            disabled={!registerAccountWrite || registerAccountIsLoading}
            onClick={() => registerAccountWrite?.()}
          >
            Create
          </Button>
        )}
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
