import React, {useEffect, useState} from "react";
import SFXLayout from "@/js/views/layout/Layout";
import SFXHeader from "@/js/views/layout/Header";
import NavMenu from "@/js/views/layout/partial/NavMenu";
import Quill from "quill";
import {getXmlData} from "@/services/utils/helpers";
import { Stack } from "@fluentui/react";
import {css} from "@emotion/css";
import {
    Link
} from "react-router-dom";
import UserMenu from "@/js/views/layout/partial/UserMenu";

const useHeader = () => {
    return <SFXHeader start={<NavMenu/>} end={<UserMenu/>}/>
}

interface IIndexArticle {
    pk: string, title: string, update_time: string
}

interface IIndexData {
    count: number,
    rows: IIndexArticle[]
}

const itemStyles = css`
  padding: 8px;
`

const dateStyles = css`
  color: #a5a5a5;
  margin-top: 8px;
`

const titleStyles = css`
  font-size: 24px;
  text-decoration: none;
  color: #000;
`

export default function HomePage() {
    console.debug('HomePage');
    const [list, setList] = useState<IIndexArticle[]>([]);
    useEffect(() => {
        const serverData = getXmlData<IIndexData>();
        console.debug('HomePage useEffect', serverData);
        if (!serverData || !serverData.rows || serverData.count < 1) {
            return;
        }
        setList(serverData.rows)
    }, []);
    const listItems = list.map((o) =>
        <Stack.Item key={o.pk} className={itemStyles}>
            <div>
                <a href={'/post/read/' + o.pk} className={titleStyles}>
                    {o.title}
                </a>
            </div>
            <div className={dateStyles}>
                <span>{o.update_time.toLocaleString()}</span>
            </div>
        </Stack.Item>
    );
    return <SFXLayout header={useHeader()} footer={<span></span>}>
        <>

            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm12 ms-xl12">
                        <Stack tokens={{childrenGap: 8}}>
                            {listItems}
                        </Stack>
                    </div>
                </div>
            </div>
        </>
    </SFXLayout>
}
