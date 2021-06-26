import {Stack} from "@fluentui/react";
import React from "react";

export interface SFXLayoutProps {
    header?: JSX.Element
    children?: JSX.Element
    footer?: JSX.Element
}

const SFXLayout = (props: SFXLayoutProps) =>{
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <header>
                    {props.header}
                </header>
            </div>
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
        </div>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <main>
                    {props.children}
                </main>
            </div>
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
        </div>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
            <div className="ms-Grid-col ms-sm12 ms-xl8">
                <footer>
                    {props.footer}
                </footer>
            </div>
            <div className="ms-Grid-col ms-sm0 ms-xl2">
            </div>
        </div>
    </div>
}

export default SFXLayout
