import React from "react";
import { FASTElement, customElement, attr } from "@microsoft/fast-element";
import ReactDOM from "react-dom";
import UserMenu from "@/views/user/menu";

@customElement('sfx-user')
export class NameTag extends FASTElement {
    @attr greeting: string = 'Hello222';

    greetingChanged() {
        this.shadowRoot!.innerHTML = this.greeting;
        console.log('greeting', this.greeting);

        const rootElement = this.shadowRoot;
        if (rootElement) {
            ReactDOM.render(<UserMenu />, rootElement);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('name-tag is now connected to the DOM');
    }
}
