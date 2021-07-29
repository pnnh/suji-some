import React from "react";
import {PrimaryButton} from "@fluentui/react";

export default function NotFoundPage() {
    return <div>
        <h2>页面未找到</h2>
        <PrimaryButton onClick={()=>{
            window.location.href = "/"
        }}>
            前往首页
        </PrimaryButton>
    </div>
}
