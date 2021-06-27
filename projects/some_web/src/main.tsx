import ReactDOM from "react-dom";
import React from "react";
import App from "./js/App";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { registerDefaultFontFaces } from '@fluentui/theme'

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

ReactDOM.render(<App />, document.getElementById('root'))
