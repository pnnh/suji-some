import React from "react";
import { FASTElement, customElement, attr } from "@microsoft/fast-element";

@customElement('sfx-header')
export class NameTag extends FASTElement {
    @attr greeting: string = 'Hello';

    greetingChanged() {
        //this.shadowRoot!.innerHTML = this.greeting;
        console.log('greeting', this.greeting);
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('name-tag is now connected to the DOM');
    }
}
