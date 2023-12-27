import { Layout } from "@/components/Layout/Layout";
import { DefaultSession, Session } from "next-auth";
import { getSession } from "next-auth/react";
import licenseABI from "@/abis/License.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  // useSignMessage,
  useWalletClient,
} from "wagmi";
import { Badge, Button, Flex, Text, Tooltip } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import {
  Account,
  BytesSizeMismatchError,
  SignMessageParameters,
  fromHex,
  keccak256,
  parseUnits,
  toBytes,
  toHex,
} from "viem";
import {
  dynamicContractRead,
  useDynamicContractRead,
  useDynamicPrepareContractWrite,
} from "@/utils/contractActions";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import AuthContext from "@/components/Auth/AuthContext";
import { readContract } from "@wagmi/core";
import CryptoJS, { SHA256, lib } from "crypto-js";
import { signMessage } from "viem/_types/accounts/utils/signMessage";
import { useSignMessage } from "@/utils/signMessage";
import {
  IconAlertOctagon,
  IconFileArrowRight,
  IconWallet,
} from "@tabler/icons";
import { LicenseApplicationStepsBox } from "@/components/Licensing/application/StepsBox";

export default function Home() {
  const { address: accountAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { sessionData } = useContext(AuthContext);

  const [firstPackedData, setFirstPackedData] = useState<BigInt>(BigInt(0));
  const [secondPackedData, setSecondPackedData] = useState<BigInt>(BigInt(0));
  const [applicationHash, setApplicationHash] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [licenseFee, setLicenseFee] = useState<string>("");

  // session address MAY differ than `accountAddress` from `useAccount()`; session address is to be used for all purposes.
  const sessionAddress = sessionData?.user?.address;

  const convertToBytes = toHex(
    `${sessionData?.user?.address}|Test Name|25 January 2000|12 Test Road, NY 12211, USA|test@gmail.com|+1123123123|None|USA|USA`
  );

  const registerAccountConfig = useDynamicPrepareContractWrite(
    "registerAccount",
    sessionAddress,
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

  const {
    isLoading: signMessageIsLoading,
    isError: signMessageError,
    isSuccess: signMessageIsSuccess,
    signature: signMessageSignature,
    sign: signFunction,
  } = useSignMessage({
    message: applicationHash,
  });

  useEffect(() => {
    console.log("is signature success: ", signMessageIsSuccess);
    if (signMessageIsSuccess) {
      setSignature((signMessageSignature as string | undefined) ?? "");
    }
  }, [signMessageIsSuccess, signMessageSignature]);

  const licenseHash = keccak256(toHex("Asset Creation"));

  const modifications = toHex("None");

  console.log("modifications: ", modifications);

  const submitApplicationConfig = useDynamicPrepareContractWrite(
    "submitApplication",
    sessionAddress,
    [
      licenseHash,
      firstPackedData,
      secondPackedData,
      signature,
      modifications,
      "lololol123123123",
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

  // pay license fee and call
  const payLicenseFeeConfig = useDynamicPrepareContractWrite(
    "payLicenseFee",
    sessionAddress,
    [applicationHash],
    BigInt("30000000000000000")
  );

  const {
    data: payLicenseFeeData,
    error: payLicenseFeeError,
    isLoading: payLicenseFeeIsLoading,
    isSuccess: payLicenseFeeIsSuccess,
    write: payLicenseFeeWrite,
  } = useContractWrite(payLicenseFeeConfig);

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

  // pay royalty config and call
  const payRoyaltyConfig = useDynamicPrepareContractWrite(
    "payRoyalty",
    sessionAddress,
    [applicationHash, BigInt(0), BigInt("30000000000000000")],
    BigInt("30000000000000000")
  );

  const {
    data: payRoyaltyData,
    error: payRoyaltyError,
    isLoading: payRoyaltyIsLoading,
    isSuccess: payRoyaltyIsSuccess,
    write: payRoyaltyWrite,
  } = useContractWrite(payRoyaltyConfig);

  const { data: licenseFeeData, error: licenseFeeError } =
    useDynamicContractRead("getLicenseFee", sessionAddress, [
      sessionAddress,
      applicationHash,
    ]);

  const { data: reportingFrequencyData, error: reportingFrequencyError } =
    useDynamicContractRead("getReportingFrequency", sessionAddress, [
      sessionAddress,
      applicationHash,
    ]);

  console.log("reporting frequency data: ", reportingFrequencyData);

  // use effect to call `getAccount` whenever `sessionAddress` changes.
  useEffect(() => {
    const getAccount = async () => {
      const data = await dynamicContractRead("getAccount", sessionAddress, [
        sessionAddress,
      ]);

      console.log("get account data: ", data);
    };

    const getPackedData = async () => {
      const data = (await dynamicContractRead("getPackedData", sessionAddress, [
        BigInt(1702115970),
        BigInt(0),
        BigInt(1702115970 + 31536000),
        BigInt("30000000000000000"),
        BigInt(10),
        BigInt(10000),
        BigInt(10000),
        BigInt(0),
        BigInt(0),
        BigInt(0),
      ])) as BigInt[];

      console.log("get packed data: ", data);

      setFirstPackedData(data[0]);
      setSecondPackedData(data[1]);
    };
    const getApplicationHash = async () => {
      const data = (await dynamicContractRead(
        "getApplicationHash",
        sessionAddress,
        [
          sessionAddress,
          licenseHash,
          firstPackedData,
          secondPackedData,
          modifications,
          "lololol123123123",
        ]
      )) as string;

      console.log("get application hash: ", data);

      setApplicationHash(data);
    };

    const callSetLicenseFee = async () => {
      console.log("license fee: ", licenseFee);
      setLicenseFee(String(Number(licenseFeeData)));
    };

    getAccount();
    getPackedData();
    getApplicationHash();
    callSetLicenseFee();
  }, [sessionAddress]);

  return (
    <>
      <Layout pageTitle="Licensing">
        <Flex direction="column" miw="100%" align="center">
          <Text size={55}>LICENSING PROCESS EXAMPLE</Text>
          <Flex
            direction="column"
            align="center"
            justify="center"
            maw="75%"
            sx={(theme) => ({
              border: "1px solid #ca4242",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "20px",
            })}
          >
            <IconAlertOctagon
              color="#ca4242"
              size={35}
              style={{ marginRight: 10 }}
            />
            <Text
              sx={(theme) => ({
                color: "#ca4242",
                fontSize: "16px",
                [theme.fn.smallerThan("sm")]: {
                  fontSize: "12px",
                },
                textAlign: "center",
              })}
            >
              <b>
                This example process interacts with the smart contract. For
                non-technical users, please refrain from refreshing this website
                when going through the example process to ensure a seamless
                tryout.
              </b>
            </Text>
          </Flex>
          <Flex direction="row" miw="100%" justify="space-around">
            <Flex direction="column" miw="75%">
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
                      1. Connect wallet
                    </Text>
                  </Flex>
                </Flex>
              </LicenseApplicationStepsBox>
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
                      2. Create Licensee Account
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
                  >
                    Create
                  </Button>
                </Flex>
              </LicenseApplicationStepsBox>
              {/* <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              disabled={!registerAccountWrite || registerAccountIsLoading}
              onClick={() => registerAccountWrite?.()}
            >
              Create Account
            </Button>
            <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              // disabled={signMessageIsLoading}
              // onClick={() => signMessage()}
              onClick={() => signFunction()}
            >
              Sign Application Hash Message
            </Button>
            <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              disabled={!submitApplicationWrite || submitApplicationIsLoading}
              onClick={() => submitApplicationWrite?.()}
            >
              Submit Application
            </Button>
            <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              disabled={!payLicenseFeeWrite || payLicenseFeeIsLoading}
              onClick={() => payLicenseFeeWrite?.()}
            >
              Pay License Fee
            </Button>
            <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              disabled={!reportWrite || reportIsLoading}
              onClick={() => reportWrite?.()}
            >
              Submit Report
            </Button>
            <Button
              sx={(theme) => ({
                backgroundColor: "#42ca9f",
                transitionDuration: "200ms",
                ":hover": {
                  transform: "scale(1.01) translate(1px, -3px)",
                  backgroundColor: "#42ca9f",
                },

                ":active": {
                  transform: "translateY(2px)",
                },
              })}
              disabled={!payRoyaltyWrite || payRoyaltyIsLoading}
              onClick={() => payRoyaltyWrite?.()}
            >
              Pay Royalty Fee
            </Button> */}
            </Flex>
            <p>Hi</p>
          </Flex>
          {/* <Flex direction="column">
            <p>Wagmi account address: {accountAddress}</p>
            <p>Session address: {sessionAddress as string}</p>
            <p>First packedData: {String(firstPackedData)}</p>
            <p>Second packedData: {String(secondPackedData)}</p>
            <p>Application Hash: {applicationHash}</p>
            <p>Message signature: {signature}</p>
            <p>License fee: {licenseFee}</p>
          </Flex> */}
        </Flex>
      </Layout>
    </>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (!session) {
//     console.log('no session found');
//   }

//   console.log('session: ', session);

//   return {
//     props: {
//       session: session as CustomSessionType | null,
//     }
//   }
// }
