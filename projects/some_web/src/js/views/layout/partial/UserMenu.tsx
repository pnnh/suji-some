import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { getJsonData} from "@/services/utils/helpers";

const useActionButton = () => {
    const auth = getJsonData<any>();
    console.debug('useActionButton', auth);
    if (auth && auth.login) {
        return <PrimaryButton onClick={()=>{
            window.location.href = "/post/new"
        }}>
            创作
        </PrimaryButton>
    } else {
        return <PrimaryButton onClick={()=>{
            window.location.href = "/account/login"
        }}>
            登录
        </PrimaryButton>
    }
}

export default function UserMenu() {
    return <Stack.Item align={'center'}>
            {useActionButton()}
        </Stack.Item>
}
