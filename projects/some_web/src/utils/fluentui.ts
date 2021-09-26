import { initializeIcons } from '@fluentui/react/lib/Icons'
import { registerDefaultFontFaces } from '@fluentui/theme'
import { isDev } from '@/utils/config'

if (isDev()) {
  initializeIcons('http://localhost:3000/fluentui/icons/') // 从自定义路劲加载FluentUI图标字体
  registerDefaultFontFaces('http://localhost:3000/fluentui') // 从自定义路劲加载FluentUI字体
} else {
  initializeIcons('https://res.sfx.xyz/fluentui/icons/') // 从自定义路劲加载FluentUI图标字体
  registerDefaultFontFaces('https://res.sfx.xyz/fluentui') // 从自定义路劲加载FluentUI字体
}
