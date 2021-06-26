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

const navLinkStyles = css`
  font-size: 16px;font-weight: 700;margin-left:8px;
`

export default function NavMenu() {
    return <>
        <Stack.Item align={'center'}>
        </Stack.Item>
    </>
}
