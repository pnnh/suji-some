import React, {CSSProperties} from "react";
import {css} from "@emotion/css";

const cardStyles = css`
  border: solid 1px #ccc;
`
const cardLineStyles = css`
  border: 0;border-bottom: solid 1px #ccc;width:100%;
`
const cardHeaderStyles = css`
  padding:8px;
`
const cardBodyStyles = css`
  padding:8px;min-height: 180px;
`

export interface ISFXCardProps {
    title: string,
    children?: JSX.Element
    style?: CSSProperties
}

export default function SFXCard(props: ISFXCardProps) {
    return <div className={cardStyles}>
        <div className={cardHeaderStyles}>{props.title}</div>
        <hr className={cardLineStyles}/>
        <div style={props.style} className={cardBodyStyles}>
            {props.children}
        </div>
    </div>
}
