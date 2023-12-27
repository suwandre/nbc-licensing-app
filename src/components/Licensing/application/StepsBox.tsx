import { Box, MantineStyleSystemProps, SystemProp } from '@mantine/core';
import { CSSProperties } from 'react';

type LicenseApplicationStepsBoxProps = {
    style?: CSSProperties | undefined,
    children: React.ReactNode,
    width?:  MantineStyleSystemProps["w"]
    marginTop?: number | undefined,
    marginBottom?: number | undefined
}

export const LicenseApplicationStepsBox = ({style, children, width, marginTop, marginBottom}: LicenseApplicationStepsBoxProps) => {
    return (
        <Box
            style={style ? style : {border: '2px solid white'}}
            w={width ? width : '100%'}
            sx={(theme) => ({
                borderRadius: theme.radius.md,
                textAlign: 'center',
                marginTop: !!marginTop ? marginTop : 45,
                marginBottom: !!marginBottom ? marginBottom : 0
            })}
        >
            {children}
        </Box>
    )
}