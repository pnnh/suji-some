import ReactDOM from "react-dom";
import React from "react";
import App from "./js/App";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { registerDefaultFontFaces } from "@fluentui/theme";
import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@fluentui/web-components";

DesignSystem.getOrCreate().register(
    Object.values(allComponents).map(definition => definition())
);

interface viteEnv {
    BASE_URL: string,
    MODE: string, DEV: boolean, PROD: boolean, SSR: boolean
}

const importMeta = (import.meta as any).env as viteEnv;

if(importMeta.DEV) {
    initializeIcons('http://localhost:3000/fluentui/icons/');    // 从自定义路劲加载FluentUI图标字体
    registerDefaultFontFaces('http://localhost:3000/fluentui');  // 从自定义路劲加载FluentUI字体
} else {
    initializeIcons('https://res.sfx.xyz/fluentui/icons/');    // 从自定义路劲加载FluentUI图标字体
    registerDefaultFontFaces('https://res.sfx.xyz/fluentui');  // 从自定义路劲加载FluentUI字体
}

// 不直接呈现React组件了，而是通过Web Component呈现
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}
