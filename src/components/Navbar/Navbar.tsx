import { Button, Group, Header, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';
import NBCLogo from '@/../public/NBCLogo.png';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    header: {
      display: 'flex',
      flex: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: 0,
      margin: '0 20px',
    },
  
    links: {
      [theme.fn.smallerThan('md')]: {
        display: 'none',
      },
    },
  
    burger: {
      zIndex: 1,
      [theme.fn.largerThan('md')]: {
        display: 'none',
      },
    },
  
    logo: {
      zIndex: 1,
    },
  
    dropdown: {
      borderRadius: 0,
      position: 'absolute',
      top: 0,
      backgroundColor: '#000000',
      margin: '0',
      width: '100%',
      left: '0',
      padding: '32px',
      paddingTop: '48px',
      [theme.fn.largerThan('md')]: {
        display: 'none',
      },
    },
  
    centerItems: {
      marginTop: 10,
      marginBottom: 10,
    },
  
    menuMargin: {
      marginTop: 3,
    },
  
    menuDropdown: {
      marginTop: 3,
      backgroundColor: '#000000',
    },
  
    connectButton: {
      backgroundColor: '#42ca9f',
      transitionDuration: '200ms',
      '&:hover': {
        transform: 'scale(1.01) translate(1px, -3px)',
        backgroundColor: '#42ca9f',
      },
  
      '&:active': {
        transform: 'translateY(2px)',
      },
    },
  
    myAccountParagraph: {
      marginRight: 5,
    },
  
    link: {
      display: 'block',
      lineHeight: 1,
      padding: '8px 12px',
      borderRadius: theme.radius.sm,
      textDecoration: 'none',
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      fontSize: theme.fontSizes.sm,
      fontWeight: 500,
  
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
      },
    },
  
    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
      },
    },
  
    linkLabel: {
      marginRight: 5,
    },
}));

// const NavbarItems = (props: any) => {
//   const enableDropdown = props.isDropdown;
//   const { classes } = useStyles();

//   const router = useRouter();

//   if (enableDropdown) {

//   }
// }

export const MainNavbar = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();

    return (
        <Header
            sx={(theme) => ({
                borderBottom: 0,
                backgroundColor: theme.fn.rgba(theme.black, 0)
            })}
            height={HEADER_HEIGHT}
            className={classes.header}
        >
          <Link href='/' className={classes.logo}>
            <Image src={NBCLogo} alt='nbc logo' width={40} height={40} priority />
          </Link>
          <Group
            spacing={20}
            className={classes.links}
          >
            <Button
              className={classes.connectButton}
            >
              Connect
            </Button>
          </Group>
        </Header>
    )
}

