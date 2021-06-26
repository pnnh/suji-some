import React from "react";
import {PrimaryButton} from "@fluentui/react";

export default function NotFoundPage() {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <div>
                    <h2>当前页面不存在</h2>
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
