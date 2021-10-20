// 媒体查询定义，需要和SCSS文件中保持一致
const screenMini = '10em' // 160px
const screenSmall = '20em' // 320px
const screenMedium = '30em' // 480px
const screenLarge = '40em' // 640px
const screenExtraLarge = '64em' // 1024px
const screen2ExtraLarge = '90em' // 1440px
const screen3ExtraLarge = '120em' // 1920px

const screenPhone = screenSmall // 手机
const screenTablet = screenLarge // 平板
const screenDesktop = screenExtraLarge // 电脑

export function isScreenPhone (): boolean {
  return window.matchMedia(`(min-width: ${screenPhone})`).matches
}

export function isScreenTablet (): boolean {
  return window.matchMedia(`(min-width: ${screenTablet})`).matches
}

export function isScreenDesktop (): boolean {
  return window.matchMedia(`(min-width: ${screenDesktop})`).matches
}
