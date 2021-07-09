import {Element as SlateElement} from "slate";
import {Descendant as SlateDescendant} from "slate/dist/interfaces/node";

export default class SFNode implements SlateElement {
    name: string;
    children: SlateDescendant[] = [];
    constructor(name: string) {
        this.name = name;
    }
}

export class SFHeaderNode extends SFNode {
    header: number;

    constructor(header: number) {
        super("header");
        this.header = header;
    }
}

export class SFParagraphNode extends SFNode {
    constructor() {
        super("paragraph");
    }
}
