import React, {useEffect, useRef, useState} from 'react';
import SFXHeader from "@/views/layout/Header";
import {getDocument, INavLink, INavLinkGroup, IStackItemStyles, Nav, PrimaryButton, Stack} from "@fluentui/react";
import {getJsonData,} from "@/utils/helpers";

const ShowHeader = (props: {pk: string}) => {
    const auth = getJsonData<any>();
    let userMenu = <Stack.Item align={'center'}>
        <PrimaryButton onClick={()=>{
            window.location.href = "/account/login"
        }}>
            登录
        </PrimaryButton>
    </Stack.Item>

    if (auth && auth.login) {
        let editBtn = <></>
        if (auth.creator) {
            editBtn = <Stack.Item align={'center'}>
                <PrimaryButton onClick={()=>{
                    window.location.href = "/article/edit/" + props.pk;
                }}>
                    编辑
                </PrimaryButton>
            </Stack.Item>
        }
        userMenu = <>
            {editBtn}
            <Stack.Item align={'center'}>
                <PrimaryButton onClick={()=>{
                    window.location.href = "/article/new"
                }}>
                    创作
                </PrimaryButton>
            </Stack.Item>
        </>
    }
    return <SFXHeader  end={userMenu}/>
}

const editorOptions = {
    modules: {
        toolbar: []
    },
    readOnly: true,
    theme: 'snow'
};

const titleItemStyles: IStackItemStyles = {
    root: {
        paddingLeft: 16,
        paddingRight: 16,
    },
};

interface PostShowPageProps {
    match: { params: { pk: string } }
}

export default function ReadPage(props: PostShowPageProps) {
    useEffect(() => {
        const serverData = getJsonData<any>();
        console.debug('serverBody=====\n', serverData);
    }, []);

    return <div>
        Read Article
    </div>
}
