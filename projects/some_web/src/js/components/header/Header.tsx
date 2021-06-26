import React from 'react'
import {
    Link
} from "react-router-dom";

import {DefaultPalette, Stack, IStackStyles, IStackTokens, IStackItemStyles, PrimaryButton} from '@fluentui/react';

const itemAlignmentsStackStyles: IStackStyles = {
    root: {
        height: 64, width: 1024
    },
};

const containerStackTokens: IStackTokens = { childrenGap: 0 };

export const HorizontalStackBasicExample: React.FunctionComponent = () => {
    return (
        <Stack tokens={containerStackTokens} horizontalAlign="center">
            <Stack horizontal disableShrink horizontalAlign="space-between" styles={itemAlignmentsStackStyles}>
                <Stack.Item align="center" >
                    <PrimaryButton>
                        <Link to="/">四方形</Link>
                    </PrimaryButton>
                </Stack.Item>
                <Stack.Item align="center">
                    <PrimaryButton>
                        <Link to="/new">创建</Link>
                    </PrimaryButton>
                </Stack.Item>
            </Stack>
        </Stack>
    );
};

export default function SFXHeader() {
    return <HorizontalStackBasicExample/>
}
