import { Global } from '@mantine/core';

const GlobalStyles = () => {
    return (
        <Global 
            styles={(theme) => ({
                body: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.black : theme.white,
                    color: theme.colorScheme === 'dark' ? theme.colors.black : theme.white,
                }
            })}
        />
    );
}

export default GlobalStyles;