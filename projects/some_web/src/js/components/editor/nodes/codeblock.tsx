import React, {CSSProperties} from "react";
import SFProp from "@/js/components/editor/nodes/node";

export class SFHeaderNode extends SFProp {
    constructor(public header: number) {
        super("header");
    }

    isActive(props: any): boolean {
        const node = props as SFHeaderNode;
        if (!node) {
            return false
        }
        return node.name === "header" && node.header == this.header;
    }
}
