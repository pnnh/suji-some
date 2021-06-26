import React from "react";
import {css} from "@emotion/css";


const editorStyles = css`
  height: 360px;
`

class SFXQuill extends React.Component<{}, {}> {

    render() {
        return <div className={editorStyles}></div>
    }
}
