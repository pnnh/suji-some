import { registerDefaultFontFaces } from '@fluentui/theme'
import { isDev } from '@/utils/config'

if (isDev()) {
  registerDefaultFontFaces('http://localhost:3000/fluentui') // 从自定义路劲加载FluentUI字体
} else {
  registerDefaultFontFaces('https://res.sfx.xyz/fluentui') // 从自定义路劲加载FluentUI字体
}
