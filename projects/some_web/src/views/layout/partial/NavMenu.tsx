import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    ActionButton,
    IStackItemStyles,
    IStackTokens,
    Link as FluentLink,
    PrimaryButton,
    Link,
    Stack
} from '@fluentui/react';
import {css} from "@emotion/css";

const navLinkStyles = css`
  font-size: 16px;font-weight: 700;margin-left:16px;color: #000;
`

export default function NavMenu() {
    return <>
        <Stack.Item align={'center'}>
            <Link href={'/'} className={navLinkStyles}>
                文章
            </Link>
        </Stack.Item>
        <Stack.Item align={'center'}>
            <Link href={'/utils/random/password'} className={navLinkStyles}>
                工具
            </Link>
        </Stack.Item>
    </>
}
