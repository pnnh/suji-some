import React from "react";
import {PrimaryButton} from "@fluentui/react";

export default function InternalServerErrorPage() {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <div>
                    <h2>服务器出现了未知错误</h2>
                    <PrimaryButton onClick={()=>{
                        window.location.href = "/"
                    }}>
                        前往首页
                    </PrimaryButton>
                </div>
            </div>
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
        </div>
    </div>
}
