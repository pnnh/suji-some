import {initializeIcons} from "@fluentui/react/lib/Icons";
import {registerDefaultFontFaces} from "@fluentui/theme";


interface viteEnv {
    BASE_URL: string,
    MODE: string, DEV: boolean, PROD: boolean, SSR: boolean
}

const importMeta = (import.meta as any).env as viteEnv;
let jsEnv = "";

if(importMeta.DEV) {
    jsEnv = "dev";
} else {
    jsEnv = "release"
}

export function IsDev(): boolean {
    return jsEnv == "dev";
}

export function IsRelease(): boolean {
    return jsEnv == "release";
}

export function getApiUrl(): string {
    if (IsDev()) {
        return "http://127.0.0.1:8080"
    }
    return "https://qst.sfx.xyz"
}

const ApiUrl = {
    article: {
        new: "/article/new",
        edit: "/article/edit/",
        read: getApiUrl() + "/blog/article/",
    }
}

export {ApiUrl}
