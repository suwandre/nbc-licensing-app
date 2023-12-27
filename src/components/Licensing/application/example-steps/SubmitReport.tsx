import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconWallet } from "@tabler/icons";

export const SubmitReportStep = () => {
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
            >
              Submit
            </Button>
          </Flex>
        </LicenseApplicationStepsBox>
      );
}