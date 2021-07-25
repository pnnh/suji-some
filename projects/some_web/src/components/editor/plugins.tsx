import React, { useCallback, useMemo, useState } from 'react';
import {HeaderName, HeaderPlugin} from "@/components/editor/nodes/header";
import {SFPlugin} from "@/components/editor/nodes/node";
import {ParagraphName, ParagraphPlugin} from "@/components/editor/nodes/paragraph";
import {CodeBlockName, CodeblockPlugin} from "@/components/editor/nodes/codeblock";

const plugins: Map<string, SFPlugin> = new Map([]);


export function registerPlugin(name: string, plugin: SFPlugin) {
    plugins.set(name, plugin);
}

export function getPlugin(name: string): SFPlugin | undefined {
    return plugins.get(name);
}

registerPlugin(HeaderName, HeaderPlugin);
registerPlugin(ParagraphName, ParagraphPlugin);
registerPlugin(CodeBlockName, CodeblockPlugin);
