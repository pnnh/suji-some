import React, {useState} from 'react'
import {ITextFieldStyles, TextField} from "@fluentui/react/lib/TextField";
import {IStackItemStyles, IStackTokens, PrimaryButton, Stack} from '@fluentui/react';
import SFXHeader from "@/js/views/layout/Header";
import SFXLayout from "@/js/views/layout/Layout";
import SFXCard from "@/js/components/card/card";
import {css} from "@emotion/css";
import {Descendant as SlateDescendant} from "slate/dist/interfaces/node";
import SFXEditor from "@/js/components/editor/editor";

type NewPageState = {
    title: string;
    email: string;
    saveErrorMsg?: string;
};

const rightStyles = css`
  width: 240px;
`
const useTitle = () => {
    const titleStyles = css`
      font-weight: 500; font-size: 20px;
    `
    return <span className={titleStyles}>修改文章</span>
}
const useHeader = (onSave: () => void) => {
    const useSave = () => {
        return <PrimaryButton onClick={()=>{
            onSave()
        }}>
            发布
        </PrimaryButton>
    }
    return <SFXHeader center={useTitle()} end={useSave()}/>
}

const editorStyles = css`
  border: 1px solid #605e5c;margin-bottom: 16px;
  min-height: 300px;  
`

const editorBodyStyles = css`
  margin-bottom: 32px;  
`

const initialValue = [{
    name: 'paragraph',
    children: [{name: 'text', text: '', }],
}];

const NewPage = (props:{}, state: NewPageState) => {
    console.debug("NewPage");
    let [title, setTitle] = useState('');
    let [errMsg, setErrMsg] = useState('');
    let [editorValue, setEditorValue] = useState<any>(initialValue);

    return <SFXLayout header={useHeader(()=>{
        console.debug("onSave", editorValue);
    })} footer={<span></span>}>
        <Stack horizontal horizontalAlign={'space-between'} tokens={{childrenGap:16}}>
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
                    <Stack.Item>
                        <div className={editorStyles}>
                            <div className={editorBodyStyles}>
                                <SFXEditor value={editorValue} onChange={(value) => {
                                    console.debug("onChange222",  );
                                    setEditorValue(value);
                                }} />
                            </div>
                        </div>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    </SFXLayout>
}

export default NewPage

