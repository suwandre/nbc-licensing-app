import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconWallet } from "@tabler/icons";

export const ApproveAccountStep = () => {
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
            3. Approve account registration
          </Text>
          <Tooltip
            multiline
            width={350}
            label="Normally, the licensor needs to approve your registration. For this example, you will manually approve your own registration."
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
          Approve
        </Button>
      </Flex>
    </LicenseApplicationStepsBox>
  );
};
