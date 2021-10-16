import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import UserMenu from '@/views/user/menu'

export function HomePage () {
  useEffect(() => {
    const rootElement = document.getElementById('user-menu')
    console.log('homepage', rootElement)
    if (rootElement) {
      ReactDOM.render(<UserMenu />, rootElement)
    }
  }, [])

  return <div></div>
}
