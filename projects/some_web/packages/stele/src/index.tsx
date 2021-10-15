import React from 'react'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import './index.scss'

export * from './editor/editor'
export * from './editor/nodes/node'
export * from './a'

export function App2 () {
  return <div>app2</div>
}

export function App3 () :string {
  return 'hhhh'
}

export function App6 () {
  return <div>App6</div>
}

initializeIcons()
// registerDefaultFontFaces('/')

// ReactDOM.render(<App />, document.getElementById('root'))