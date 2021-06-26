import React from "react";
import { FASTElement, customElement, attr } from '@microsoft/fast-element';

@customElement('name-tag')
export class NameTag extends FASTElement {
    @attr greeting: string = 'Hello';

    greetingChanged() {
        this.shadowRoot!.innerHTML = this.greeting;
    }
}
