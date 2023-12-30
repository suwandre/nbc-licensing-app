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
import { ConnectWalletStep } from "@/components/Licensing/application/example-steps/ConnectWallet";
import { LicenseeAccountStep } from "@/components/Licensing/application/example-steps/LicenseeAccount";
import { ApproveAccountStep } from "@/components/Licensing/application/example-steps/ApproveAccount";
import { ChooseLicenseStep } from "@/components/Licensing/application/example-steps/ChooseLicense";
import { SignApplicationStep } from "@/components/Licensing/application/example-steps/SignApplication";
import { SubmitApplicationStep } from "@/components/Licensing/application/example-steps/SubmitApplication";
import { PayFeeStep } from "@/components/Licensing/application/example-steps/PayFee";
import { ApproveApplicationStep } from "@/components/Licensing/application/example-steps/ApproveApplication";
import { SubmitReportStep } from "@/components/Licensing/application/example-steps/SubmitReport";
import { ApproveReportStep } from "@/components/Licensing/application/example-steps/ApproveReport";
import { PayRoyaltyStep } from "@/components/Licensing/application/example-steps/PayRoyalty";
import { StepsDataBox } from "@/components/Licensing/application/steps-data/StepsDataBox";

export default function Home() {
  const { address: accountAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { sessionData } = useContext(AuthContext);

  const [firstPackedData, setFirstPackedData] = useState<BigInt>(BigInt(0));
  const [secondPackedData, setSecondPackedData] = useState<BigInt>(BigInt(0));
  const [applicationHash, setApplicationHash] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [licenseFee, setLicenseFee] = useState<string>("");
  const [licenseType, setLicenseType] = useState<string>('Asset Creation');

  console.log('signature: ', signature);

  // session address MAY differ than `accountAddress` from `useAccount()`; session address is to be used for all purposes.
  const sessionAddress = sessionData?.user?.address;

  const licenseHash = keccak256(toHex("Asset Creation"));

  const modifications = toHex("None");

  console.log("modifications: ", modifications);

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

    const callSetLicenseFee = async () => {
      console.log("license fee: ", licenseFee);
      setLicenseFee(String(Number(licenseFeeData)));
    };

    getAccount();
    getPackedData();
    callSetLicenseFee();
  }, [sessionAddress]);

  useEffect(() => {
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
          "hashsalttest",
        ]
      )) as string;

      console.log("get application hash: ", data);

      setApplicationHash(data);
    };

    if (
      sessionAddress && 
      licenseHash && 
      firstPackedData && 
      secondPackedData &&
      modifications
    ) {
      getApplicationHash();
    }
  }, [sessionAddress, licenseHash, firstPackedData, secondPackedData, modifications]);

  return (
    <>
      <Layout pageTitle="Licensing">
        <Flex direction="column" miw="100%" align="center" justify='center'>
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
                <br />
                <br />
                The tooltip on each step provides a brief description of what that respective step does, but not fully.
                <br />
                It is recommended to thoroughly read the documentation of the entire process in detail HERE.
              </b>
            </Text>
          </Flex>
          <Flex direction="row" miw='90%' justify='space-around'>
            <Flex direction="column" miw="50%" justify='center'>
              <ConnectWalletStep 
                walletConnected={!!sessionData?.user?.address}
              />
              <LicenseeAccountStep 
                sessionData={sessionData}
              />
              <ApproveAccountStep 
                sessionData={sessionData}
              />
              <ChooseLicenseStep 
                licenseType={licenseType}
                setLicenseType={setLicenseType}
              />
              <SignApplicationStep 
                applicationHash={applicationHash}
                signature={signature}
                setSignature={setSignature}
              />
              <SubmitApplicationStep 
                sessionAddress={sessionData?.user?.address}
                licenseHash={licenseHash}
                firstPackedData={firstPackedData}
                secondPackedData={secondPackedData}
                signature={signature}
                modifications={modifications}
                applicationHash={applicationHash}
              />
              <PayFeeStep 
                sessionAddress={sessionAddress}
                applicationHash={applicationHash}
              />
              <ApproveApplicationStep />
              <SubmitReportStep />
              <ApproveReportStep />
              <PayRoyaltyStep />
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
            <StepsDataBox 
              walletAddress={sessionAddress as string ?? 'N/A'}
              firstPackedData={firstPackedData}
              secondPackedData={secondPackedData}
              licenseType={licenseType}
              applicationHash={applicationHash}
              signature={signature}
              licenseFee={licenseFee}
            />
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
