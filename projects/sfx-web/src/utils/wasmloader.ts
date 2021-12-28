
import { QtLoader, Module } from '@/utils/qtloader'

// window.Module = Module
// window.QtLoader = QtLoader
// Module.locateFile = function (path, prefix) {
//   console.log('locateFile', path, prefix)
//   return prefix + path
// }
// document.addEventListener('DOMContentLoaded', function () {
//   console.log('3 seconds passed')
//   const qtCanvas = document.getElementById('qt-canvas')
//   if (qtCanvas) {
//     const qtLoader = window.QtLoader({
//       canvasElements: [qtCanvas],
//       showLoader: function () { },
//       showError: function (errorMessage) {
//         console.log('showError', errorMessage)
//       },
//       showExit: function () {
//       },
//       showCanvas: function () {
//       }
//     })
//     qtLoader.loadEmscriptenModule('http://127.0.0.1:3000/wasm/qt-canvas')
//   }
// })
