import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import Quill from 'quill'
import {css} from "@emotion/css";
import SFXLayout from "@/js/views/layout/Layout";
import SFXHeader from "@/js/views/layout/Header";
import {getDocument, INavLink, INavLinkGroup, IStackItemStyles, Nav, PrimaryButton, Stack} from "@fluentui/react";
import {getJsonData, getXmlData} from "@/services/utils/helpers";

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
                    window.location.href = "/post/edit/" + props.pk;
                }}>
                    编辑
                </PrimaryButton>
            </Stack.Item>
        }
        userMenu = <>
            {editBtn}
            <Stack.Item align={'center'}>
                <PrimaryButton onClick={()=>{
                    window.location.href = "/post/new"
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

export default class PostShowPage extends React.Component<PostShowPageProps, {}> {
    editor?: Quill;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const serverData = getJsonData<any>();
        console.debug('serverBody=====\n', serverData.body);
        const packet = JSON.parse(serverData.body);
        const editor = new Quill('#sfxeditor',editorOptions);
        editor.setContents(packet);

        const titleEl = document.getElementById('sfxtitle');
        if (titleEl) {
            titleEl.innerHTML = serverData.title;
        }
    }
    render() {
        return <SFXLayout header={<ShowHeader pk={this.props.match.params.pk} />} footer={<span></span>}>
            <Stack tokens={{childrenGap:16}}>
                <Stack.Item grow={1}>
                    <Stack tokens={{childrenGap: 8}}>
                        <Stack.Item styles={titleItemStyles}>
                            <h1 id={'sfxtitle'} className={'sfxtitle'}></h1>
                        </Stack.Item>
                        <Stack.Item align={'start'}>
                            <div className={'sfxparent'}>
                                <div id={'sfxeditor'} className={'sfxeditor'}></div>
                            </div>
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </SFXLayout>
    }
}
