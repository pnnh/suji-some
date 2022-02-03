import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'


@customElement('my-element')
class MyElement extends LitElement {
  @property({type: String}) name2 = 'World'

  render () {
    return html`
      <div>Hello from MyElement! ${this.name2}</div>
      <button @click="${this._handleClick}">click</button>
    `
  }

  firstUpdated () {
    console.log('firstUpdated')
    const event = new CustomEvent('my-event', {
      detail: {
        message: 'Something important happened'
      },
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  private _handleClick (e) {
    console.log('assssss')

    this.firstUpdated()
  }
}
