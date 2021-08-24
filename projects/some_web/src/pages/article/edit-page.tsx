import React, {useEffect, useState} from 'react'
import {ITextFieldStyles, TextField} from "@fluentui/react/lib/TextField";
import {IStackItemStyles, IStackTokens, PrimaryButton, Stack} from '@fluentui/react';
import {css} from "@emotion/css";
import SFXEditor from "@/components/editor/editor";
import {SFDescendant, SFEditor} from "@/components/editor/nodes/node";
import {getJsonData, updateTitle} from "@/utils/helpers";
import {onEdit} from "@/pages/article/partial/save";

type NewPageState = {
    title: string;
    email: string;
    saveErrorMsg?: string;
};

const initialValue = {
    children: [{
        name: 'paragraph',
        children: [{name: 'text', text: '', }],
    }]
};

const descriptionStyles = css`
  margin-bottom: 16px;
`
const EditPage = (props:{match: { params: { pk: string } }}, state: NewPageState) => {
    console.debug("EditPage");
    let [title, setTitle] = useState('');
    let [errMsg, setErrMsg] = useState('');
    let [keywords, setKeywords] = useState('');
    let [description, setDescription] = useState('');
    let [editorValue, setEditorValue] = useState<SFEditor>(initialValue);

    useEffect(() => {
        const serverData = getJsonData<any>();
        console.debug("NewPage useEffect", serverData);
        setTitle(serverData.title);
        setEditorValue(serverData.body);
        setKeywords(serverData.keywords);
        setDescription(serverData.description);
        updateTitle(serverData.title);
    }, []);

    return <Stack horizontal horizontalAlign={'space-between'} tokens={{childrenGap:16}}>
            <Stack.Item grow={1}>
                <Stack tokens={{childrenGap: 8}}>
                    <Stack.Item>
                        <TextField placeholder={'标题'} value={title}
                                   onChange={(event, value)=>{
                                       if(!value) {
                                           return;
                                       }
                                       setTitle(value);
                                   }}/>
                    </Stack.Item>
                    <Stack.Item className={descriptionStyles}>
                        <TextField placeholder={'描述'} multiline={true} value={description}
                                   onChange={(event, value)=>{
                                       if(!value) {
                                           return;
                                       }
                                       setDescription(value);
                                   }}/>
                    </Stack.Item>
                    <Stack.Item>
                        <SFXEditor value={editorValue} onChange={(value) => {
                            console.debug("onChange222",  );
                            setEditorValue(value);
                        }} />
                    </Stack.Item>
                    <Stack.Item className={descriptionStyles}>
                        <TextField placeholder={'关键字'} title={"逗号分隔"} value={keywords}
                                   onChange={(event, value)=>{
                                       if(!value) {
                                           return;
                                       }
                                       setKeywords(value);
                                   }}/>
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton onClick={()=>{
                            console.debug("onSave", editorValue);
                            console.debug("onSave2", JSON.stringify(editorValue));
                            onEdit(props.match.params.pk, editorValue, title, description, keywords);
                        }}>
                            发布
                        </PrimaryButton>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
}

export default EditPage

