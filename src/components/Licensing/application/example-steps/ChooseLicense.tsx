import { Badge, Button, Flex, NativeSelect, Text, Tooltip } from "@mantine/core";
import { LicenseApplicationStepsBox } from "../StepsBox";
import { IconLicense, IconWallet } from "@tabler/icons";

type ChooseLicenseStepProps = {
    licenseType: string,
    setLicenseType: (licenseType: string) => void
}

export const ChooseLicenseStep = ({
  licenseType,
  setLicenseType
}: ChooseLicenseStepProps) => {
    return (
        <LicenseApplicationStepsBox 
          marginTop={20}
          style={{ border: '2px solid #42ca9f' }}
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
              <IconLicense size={25} color='#42ca9f' />
              <Text
                color={"#42ca9f"}
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
                4. Choose license type
              </Text>
              <Tooltip
                multiline
                width={350}
                label="Choose the license type you want to apply for. Simply pick any for this case."
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
            <NativeSelect 
              mr={25}
              data={['Asset Creation', 'Existing Asset Usage', 'Asset Modification']}
              value={licenseType}
              onChange={(e: any) => setLicenseType(e.currentTarget.value)}
              defaultValue={'Asset Creation'}
            />
          </Flex>
        </LicenseApplicationStepsBox>
      );
}