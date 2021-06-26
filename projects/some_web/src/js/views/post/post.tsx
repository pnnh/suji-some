import React from 'react'
import Quill from 'quill'
import {css} from "@emotion/css";
import SFXLayout from "@/js/views/layout/Layout";
import SFXHeader from "@/js/views/layout/Header";
import {INavLinkGroup, PrimaryButton, Stack} from "@fluentui/react";
import SFXCard from "@/js/components/card/card";
import Delta from 'quill-delta';
import {articlePost} from "@/services/some/article";
import {TextField} from '@fluentui/react/lib/TextField';

const editorStyles = css`
  height: 480px;
`
const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] },
        { 'font': [] },
        'bold',
        'italic',
        'underline',
        'strike', { 'color': [] }, { 'background': [] }, { 'align': [] },
        'blockquote',
        'code-block',],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
];
const editorOptions = {
    //debug: 'info',
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: '请输入内容',
    readOnly: false,
    theme: 'snow'
};

const useTitle = () => {
    const titleStyles = css`
      font-weight: 500; font-size: 20px;
    `
    return <span className={titleStyles}>写文章</span>
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
const rightStyles = css`
  width: 240px;
`


interface IArticle{
    title: string
    body: Delta
}

interface SFPostPageProps {
    match: { params: { pk: string } }
}

interface SFPostPageState {
    title: string
    navLinks: INavLinkGroup[]
}

export default class PostPage extends React.Component<SFPostPageProps, SFPostPageState> {
    editor?: Quill;
    constructor(props) {
        super(props);
        this.state = {
            title: '', navLinks: [],
        }
    }
    componentDidMount() {
        console.debug('jjjjjj componentDidMount', this.props.match.params);
        this.editor = new Quill('#editor', editorOptions);
        const data = localStorage.getItem('post');
        if (!data) {
            return;
        }
        const article = JSON.parse(data)
        this.setState({
            title: article.title,
        })
        this.editor.setContents(article.body)
        this.editor.on('editor-change', () => {

            console.debug('jjjjjj onChange222')
        });
    }
    getArticle(): IArticle | null {
        if (!this.editor) {
            return null;
        }
        const contents = this.editor.getContents();
        console.debug("contents", contents)
        //const packet = JSON.stringify(contents);
        return {
            title: this.state.title, body: contents,
        }
    }
    onSave() {
        const article = this.getArticle();
        console.debug("packet", article);
        if (!article) {
            return;
        }
        const postData = {
            title: article.title,
            body: JSON.stringify(article.body),
        }
        articlePost(postData).then((out)=>{
            console.debug("ok", out);
            if(out) {
                window.location.href = "/post/read/" + out.pk;
            }
        })
    }
    render() {
        return <SFXLayout header={useHeader(()=>this.onSave())} footer={<span></span>}>
            <Stack horizontal horizontalAlign={'space-between'} tokens={{childrenGap:16}}>
                <Stack.Item>
                    {/*<Stack className={leftStyles} tokens={{childrenGap: 16}}>*/}
                    {/*    /!*<SFXCard title={'目录'} style={{maxHeight:640, overflow: 'auto'}}>*!/*/}
                    {/*    /!*    <Nav ariaLabel="Nav example with nested links"*!/*/}
                    {/*    /!*         groups={this.state.navLinks} />*!/*/}
                    {/*    /!*</SFXCard>*!/*/}
                    {/*</Stack>*/}
                </Stack.Item>
                <Stack.Item grow={1}>
                    <Stack tokens={{childrenGap: 8}}>
                        <Stack.Item>
                            <TextField placeholder={'标题'} value={this.state.title}
                                       onChange={(event, value)=>{
                                           if(!value) {
                                               return;
                                           }
                                           this.setState({ title: value})
                                       }}/>
                        </Stack.Item>
                        <Stack.Item>
                            <div id={'editor'} className={editorStyles}></div>
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    <Stack className={rightStyles} tokens={{childrenGap: 16}}>
                        <SFXCard title={'其它信息'}>
                            <span>body</span>
                        </SFXCard>
                    </Stack>
                </Stack.Item>
            </Stack>
        </SFXLayout>
    }
}
