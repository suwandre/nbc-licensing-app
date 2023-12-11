import {
  Burger,
  Button,
  Center,
  Divider,
  Group,
  Header,
  Menu,
  Paper,
  Text,
  Transition,
  createStyles,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import NBCLogo from "@/../public/NBCLogo.png";
import { useRouter } from "next/router";
import { connect, fetchEnsName } from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { ConnectButton } from "../Buttons/Connect";
import { DisconnectButton } from "../Buttons/Disconnect";
import { IconBox, IconChevronDown, IconLayoutDashboard, IconLogout, IconMoneybag, IconPool, IconReceipt, IconUser } from "@tabler/icons";
import { getSession, signOut } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Auth/AuthContext";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    flex: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: 0,
    margin: "0 20px",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  burger: {
    zIndex: 1,
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  logo: {
    zIndex: 1,
  },

  dropdown: {
    borderRadius: 0,
    position: "absolute",
    top: 0,
    backgroundColor: "#000000",
    margin: "0",
    width: "100%",
    left: "0",
    padding: "32px",
    paddingTop: "48px",
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  centerItems: {
    marginTop: 15,
    marginBottom: 15,
  },

  menuMargin: {
    marginTop: 3,
  },

  menuDropdown: {
    marginTop: 3,
    backgroundColor: "#000000",
  },

  connectButton: {
    backgroundColor: "#42ca9f",
    transitionDuration: "200ms",
    "&:hover": {
      transform: "scale(1.01) translate(1px, -3px)",
      backgroundColor: "#42ca9f",
    },

    "&:active": {
      transform: "translateY(2px)",
    },
  },

  transparentButton: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
      transform: "scale(1.01) translate(1px, -3px)",
      transitionDuration: "200ms",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
  },

  myAccountParagraph: {
    marginRight: 5,
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

// when user is authenticated, this is the account menu that will be displayed
const AuthenticatedAccountMenu = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const { disconnectAsync } = useDisconnect();

  const handleLogout = async () => {
    // disconnects from WAGMI
    await disconnectAsync();
    // disconnects from next-auth, removing the session cookie
    await signOut();

    router.replace('/');
  }

  return (
    <>
      <Menu shadow='md' width={200}>
        <Menu.Target>
          <Button className={classes.connectButton}>
            <p className={classes.myAccountParagraph}>My Account</p>
            <IconChevronDown size={15} />
          </Button>
        </Menu.Target>

        <Menu.Dropdown className={classes.menuDropdown}>
          <Menu.Item
            onClick={() => router.push('/account/dashboard')}
            icon={<IconLayoutDashboard size={14} />}
          >
            <Text>Account Dashboard</Text>
          </Menu.Item>
          <Menu.Item
            onClick={() => router.push('/account/settings')}
            icon={<IconUser size={14} />}
          >
            <Text>Account Settings</Text>
          </Menu.Item>
          <Divider />
          <Menu.Item onClick={handleLogout} icon={<IconLogout size={14} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}

const NavbarMenu = (props: any) => {
  const enableDropdown = props.isDropdown;
  const { classes } = useStyles();
  const router = useRouter();

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Center className={enableDropdown && classes.centerItems}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button className={classes.transparentButton}>
              <Text>Licensing</Text>
              <IconChevronDown size={15} />
            </Button>
          </Menu.Target>

          <Menu.Dropdown className={classes.menuDropdown}>
            <Menu.Item
              onClick={() => router.push("/apply")}
              icon={<IconMoneybag size={14} />}
            >
              <Text>Apply</Text>
            </Menu.Item>
            <Divider />
            <Menu.Item
              icon={<IconPool size={14} />}
              onClick={() => router.replace("/test2")}
            >
              Test 2
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>
      <Center className={enableDropdown && classes.centerItems}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button
              className={classes.transparentButton}
              onClick={() => router.replace('https://webapp.nbcompany.io/')}
            >
              <Text>Main Webapp</Text>
            </Button>
          </Menu.Target>
        </Menu>
      </Center>
      <Center className={classes.centerItems}>
        {!isAuthenticated ? (
          <ConnectButton />
        ) : (
          <AuthenticatedAccountMenu />
        )}
      </Center>
    </>
  );
};

export const MainNavbar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  return (
    <Header
      sx={(theme) => ({
        borderBottom: 0,
        backgroundColor: theme.fn.rgba(theme.black, 0),
      })}
      height={HEADER_HEIGHT}
      className={classes.header}
    >
      <Link href="/" className={classes.logo}>
        <Image src={NBCLogo} alt="nbc logo" width={40} height={40} priority />
      </Link>
      <Group spacing={20} className={classes.links}>
        <NavbarMenu />
      </Group>

      <Burger
        opened={opened}
        onClick={toggle}
        className={classes.burger}
        size="sm"
      />
      <Transition transition="pop-top-right" duration={200} mounted={opened}>
        {(styles) => (
          <Paper className={classes.dropdown}>
            <NavbarMenu isDropdown />
          </Paper>
        )}
      </Transition>
    </Header>
  );
};
