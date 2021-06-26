import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    ActionButton,
    IStackItemStyles,
    IStackTokens,
    Link as FluentLink,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import {
    Link
} from "react-router-dom";
import {css} from "@emotion/css";
import {useHistory} from "react-router";
import {IStackStyles} from "@fluentui/react";

export interface SFXHeaderProps {
    start?: JSX.Element
    center?: JSX.Element
    end?: JSX.Element
}
const navStackStyles: IStackStyles = {
    root: {
        height: '64px', paddingLeft: 8, paddingRight: 8,
    },
};
export default function SFXHeader(props: SFXHeaderProps) {
    return <nav>
        <Stack horizontal horizontalAlign="start"
               styles={navStackStyles}>
            <Stack.Item align={'center'}>
                <a href="/" className={'logo'} title={'首页'}>sfx.xyz</a>
            </Stack.Item>
            <Stack.Item grow={1} align={'center'}>
                <Stack horizontal horizontalAlign="space-between">
                    <Stack.Item align={'center'} grow={1}>
                        <Stack horizontal horizontalAlign="start" tokens={{childrenGap: 8}}>
                            {props.start}
                        </Stack>
                    </Stack.Item>
                    <Stack.Item align={'center'} grow={1}>
                        <Stack horizontal horizontalAlign="center" tokens={{childrenGap: 8}}>
                            {props.center}
                        </Stack>
                    </Stack.Item>
                    <Stack.Item align={'center'} grow={1}>
                        <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 8}}>
                            {props.end}
                        </Stack>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    </nav>
}
