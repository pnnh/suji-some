import React, { useCallback, useMemo, useState } from 'react';
import {SFDescendant} from "@/components/editor/nodes/node";
import {Editor, Element as SlateElement, Node as SlateNode} from "slate";
import {ReactEditor, useSlate} from "slate-react";
import {getPlugin} from "@/components/editor/plugins";

export function SFToolbox(props: {descendant: SFDescendant}) {
    console.debug("SFToolbox");
    const editor = useSlate() as ReactEditor;
    let plugins: string[] = [];
    const [entry] = Editor.nodes(editor, {
        match: (n: SlateNode) => {
            if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
                let node = n as any;
                if (typeof node.name == "string") {
                    plugins.push(node.name);
                    return true;
                }
            }
            return false;
        },
    });
    console.debug("plugins", plugins, entry);

    let child = <div>toolbox</div>
    if(Array.isArray(entry)) {
        const [match] = entry;
        console.debug("plugins2", match);
        let node = match as any;
        if (typeof node.name == "string") {
            const plugin = getPlugin(node.name);
            if (plugin) {
                child = plugin.renderToolbox(node);
            }
        }
    }
    return <div>
        {child}
    </div>
}
