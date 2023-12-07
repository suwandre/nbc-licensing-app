import { web3Disconnect } from '@/utils/web3Auth';
import { Button, createStyles } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { useDisconnect } from 'wagmi';

const useStyles = createStyles((theme) => ({
    disconnectButton: {
        backgroundColor: '#42ca9f',
        transitionDuration: '200ms',
        '&:hover': {
          transform: 'scale(1.01) translate(1px, -3px)',
          backgroundColor: '#42ca9f',
        },
    
        '&:active': {
          transform: 'translateY(2px)',
        },
      }
}))

export const DisconnectButton = () => {
    const { disconnectAsync } = useDisconnect();
    const { classes } = useStyles();

    const handleDisconnect = async () => {
        await web3Disconnect(disconnectAsync, signOut);
        window.location.reload();
    }

    return (
        <Button
            className={classes.disconnectButton}
            onClick={handleDisconnect}
        >
            Disconnect
        </Button>
    )
}