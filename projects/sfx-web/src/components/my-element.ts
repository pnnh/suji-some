import {html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'

@customElement('my-item')
class MyItem extends LitElement {
  render () {
    return html`
      <div>Hello from MyItem!</div>
      <button @click="${this._handleClick}">MyItemClick</button>
    `
  }

  private _handleClick () {
    console.log('MyItemClickassssss')
    const event = new CustomEvent('onItem', {
      detail: {
        message: 'Something onItem'
      },
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }
}


@customElement('my-element')
class MyElement extends LitElement {
  @property({type: String}) name2 = 'World'

  render () {
    return html`
      <div>Hello from MyElement! ${this.name2}</div>
      <button @click="${this._handleClick}">click</button>
      <my-item @onItem="${this._handleClick2}"></my-item>
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

  private _handleClick2 () {
    console.log('MyItemClic Callback')
  }

  private _handleClick () {
    console.log('assssss')

    this.firstUpdated()
  }
}
