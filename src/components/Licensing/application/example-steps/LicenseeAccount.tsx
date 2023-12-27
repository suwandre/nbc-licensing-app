import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core"
import { LicenseApplicationStepsBox } from "../StepsBox"
import { IconFileArrowRight } from "@tabler/icons"
import { CustomSessionType } from "@/utils/session"

type LicenseeAccountStepProps = {
    registerAccountWrite: (() => void) | undefined,
    registerAccountIsLoading: boolean,
    sessionData: CustomSessionType | null
}

export const LicenseeAccountStep = ({
    registerAccountWrite,
    registerAccountIsLoading,
    sessionData
}: LicenseeAccountStepProps) => {
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
                    <IconFileArrowRight size={25} />
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
                </Flex>
              </LicenseApplicationStepsBox>
    )
}