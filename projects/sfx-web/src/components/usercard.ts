export class UserCard extends HTMLElement {
  constructor () {
    super()

    const image = document.createElement('img')
    image.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png'
    image.classList.add('image')

    const container = document.createElement('div')
    container.classList.add('container')

    const name = document.createElement('p')
    name.classList.add('name')
    name.innerText = 'User Name'

    const email = document.createElement('p')
    email.classList.add('email')
    email.innerText = 'yourmail@some-email.com'

    const button = document.createElement('button')
    button.classList.add('button')
    button.innerText = 'Follow'
    const myEvent = new CustomEvent('pop', {
      detail: '这是子组件传过来的消息',
      bubbles: true,
      composed: true
    })
    button.addEventListener('click', () => {
      this.dispatchEvent(myEvent)
      console.log('===', this.onpop, this.getAttribute('onpop'),
        typeof this.getAttribute('onpop'))
      if (this.onpop) {
        this.onpop()
      } else {
        eval(this.getAttribute('onpop'))
      }
    })

    container.append(name, email, button)
    // const shadow = this.attachShadow({mode: 'closed'})
    // shadow.append(container)
    this.append(container)
  }
}

window.customElements.define('user-card', UserCard)
