import React from "react";
import {PrimaryButton} from "@fluentui/react";

export default function UnauthorizedPage() {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <div>
                    <h2>您无权访问该页面</h2>
                    <PrimaryButton onClick={()=>{
                        window.location.href = "/account/login"
                    }}>
                        前往登录
                    </PrimaryButton>
                </div>
            </div>
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
        </div>
    </div>
}
