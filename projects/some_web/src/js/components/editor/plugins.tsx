import React, { useCallback, useMemo, useState } from 'react';
import {HeaderName, HeaderPlugin} from "@/js/components/editor/nodes/header";
import {SFPlugin} from "@/js/components/editor/nodes/node";
import {ParagraphName, ParagraphPlugin} from "@/js/components/editor/nodes/paragraph";
import {CodeblockName, CodeblockPlugin} from "@/js/components/editor/nodes/codeblock";

const plugins: Map<string, SFPlugin> = new Map([]);


export function registerPlugin(name: string, plugin: SFPlugin) {
    plugins.set(name, plugin);
}

export function getPlugin(name: string): SFPlugin | undefined {
    return plugins.get(name);
}

registerPlugin(HeaderName, HeaderPlugin);
registerPlugin(ParagraphName, ParagraphPlugin);
registerPlugin(CodeblockName, CodeblockPlugin);
