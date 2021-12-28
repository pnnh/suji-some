import { Version } from '@/gen/version'

const Module:any = {}
export { Module }
export function QtLoader (config: any) {
  function webAssemblySupported () {
    return typeof WebAssembly !== 'undefined'
  }

  function webGLSupported () {
    // We expect that WebGL is supported if WebAssembly is; however
    // the GPU may be blacklisted.
    try {
      const canvas = document.createElement('canvas')
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch (e) {
      return false
    }
  }

  function canLoadQt () {
    return webAssemblySupported() && webGLSupported()
  }

  config.restartMode = config.restartMode || 'DoNotRestart'
  config.restartLimit = config.restartLimit || 10

  if (config.stdoutEnabled === undefined) config.stdoutEnabled = true
  if (config.stderrEnabled === undefined) config.stderrEnabled = true

  // Make sure config.path is defined and ends with "/" if needed
  if (config.path === undefined) { config.path = '' }
  if (config.path.length > 0 && !config.path.endsWith('/')) { config.path = config.path.concat('/') }

  if (config.environment === undefined) { config.environment = {} }

  const publicAPI: any = {}
  publicAPI.webAssemblySupported = webAssemblySupported()
  publicAPI.webGLSupported = webGLSupported()
  publicAPI.canLoadQt = canLoadQt()
  publicAPI.canLoadApplication = canLoadQt()
  publicAPI.status = undefined
  publicAPI.loadEmscriptenModule = loadEmscriptenModule
  publicAPI.addCanvasElement = addCanvasElement
  publicAPI.removeCanvasElement = removeCanvasElement
  publicAPI.resizeCanvasElement = resizeCanvasElement

  function fetchResource (filePath: string) {
    let fullPath = config.path + filePath
    if (fullPath.indexOf('?') > 0) {
      fullPath += ('&v=' + Version)
    } else {
      fullPath += ('?v=' + Version)
    }
    return fetch(fullPath).then(function (response) {
      if (!response.ok) {
        const error = response.status + ' ' + response.statusText + ' ' + response.url
        setStatus('Error')
        return Promise.reject(error)
      } else {
        return response
      }
    })
  }

  function fetchText (filePath: string) {
    return fetchResource(filePath).then(function (response) {
      return response.text()
    })
  }

  function fetchThenCompileWasm (response: any) {
    return response.arrayBuffer().then(function (data: any) {
      setStatus('Loading')
      return WebAssembly.compile(data)
    })
  }

  function fetchCompileWasm (filePath: string) {
    return fetchResource(filePath).then(function (response) {
      if (typeof WebAssembly.compileStreaming !== 'undefined') {
        setStatus('Loading')
        return WebAssembly.compileStreaming(response).catch(() => {
          return fetchThenCompileWasm(response)
        })
      } else {
        // Fall back to fetch, then compile if compileStreaming is not supported
        return fetchThenCompileWasm(response)
      }
    })
  }

  function loadEmscriptenModule (applicationName: string) {
    // Loading in qtloader.js goes through four steps:
    // 1) Check prerequisites
    // 2) Download resources
    // 3) Configure the emscripten Module object
    // 4) Start the emcripten runtime, after which emscripten takes over

    // Check for Wasm & WebGL support; set error and return before downloading resources if missing
    if (!webAssemblySupported()) {
      const error = 'Error: WebAssembly is not supported'
      setStatus('Error' + error)
      return
    }
    if (!webGLSupported()) {
      const error = 'Error: WebGL is not supported'
      setStatus('Error' + error)
      return
    }

    // Continue waiting if loadEmscriptenModule() is called again
    if (publicAPI.status === 'Loading') { return }
    const loaderSubState = 'Downloading'
    setStatus('Loading' + loaderSubState)

    // Fetch emscripten generated javascript runtime
    let emscriptenModuleSource: any
    const emscriptenModuleSourcePromise = fetchText(applicationName + '.js').then(function (source) {
      emscriptenModuleSource = source
    })

    // Fetch and compile wasm module
    let wasmModule: any
    const wasmModulePromise = fetchCompileWasm(applicationName + '.wasm').then(function (module) {
      wasmModule = module
    })

    // Wait for all resources ready
    Promise.all([emscriptenModuleSourcePromise, wasmModulePromise]).then(function () {
      completeLoadEmscriptenModule(applicationName, emscriptenModuleSource, wasmModule)
    }).catch(function (error) {
      setStatus('Error' + error)
    })
  }

  function completeLoadEmscriptenModule (applicationName: any, emscriptenModuleSource: any, wasmModule: any) {
    // The wasm binary has been compiled into a module during resource download,
    // and is ready to be instantiated. Define the instantiateWasm callback which
    // emscripten will call to create the instance.
    Module.instantiateWasm = function (imports: any, successCallback: any) {
      WebAssembly.instantiate(wasmModule, imports).then(function (instance) {
        successCallback(instance, wasmModule)
      }, function (error) {
        setStatus('Error' + error)
      })
      return {}
    }

    Module.locateFile = Module.locateFile || function (filename: any) {
      return config.path + filename
    }

    Module.print = Module.print || function (text: any) {
      if (config.stdoutEnabled) { console.log(text) }
    }
    Module.printErr = Module.printErr || function (text: any) {
      // Filter out OpenGL getProcAddress warnings. Qt tries to resolve
      // all possible function/extension names at startup which causes
      // emscripten to spam the console log with warnings.
      if (text.startsWith !== undefined && text.startsWith('bad name in getProcAddress:')) { return }

      if (config.stderrEnabled) { console.log(text) }
    }

    // Error handling: set status to "Exited", update crashed and
    // exitCode according to exit type.
    // Emscripten will typically call printErr with the error text
    // as well. Note that emscripten may also throw exceptions from
    // async callbacks. These should be handled in window.onerror by user code.
    Module.onAbort = Module.onAbort || function (text: any) {
      publicAPI.crashed = true
      publicAPI.exitText = text
      setStatus('Exited')
    }
    Module.quit = Module.quit || function (code: any, exception: any) {
      if (exception.name === 'ExitStatus') {
        // Clean exit with code
        publicAPI.exitText = undefined
        publicAPI.exitCode = code
      } else {
        publicAPI.exitText = exception.toString()
        publicAPI.crashed = true
      }
      setStatus('Exited')
    }

    // Set environment variables
    Module.preRun = Module.preRun || []

    Module.mainScriptUrlOrBlob = new Blob([emscriptenModuleSource], { type: 'text/javascript' })

    Module.qtCanvasElements = config.canvasElements

    publicAPI.exitCode = undefined
    publicAPI.exitText = undefined
    publicAPI.crashed = false

    // Finally evaluate the emscripten application script, which will
    // reference the global Module object created above.
    self.eval(emscriptenModuleSource) // ES5 indirect global scope eval
  }

  function setStatus (status: string) {
    if (status !== 'Loading' && publicAPI.status === status) { return }
    publicAPI.status = status
  }

  function addCanvasElement (element: any) {
    if (publicAPI.status === 'Running') { Module.qtAddCanvasElement(element) } else { console.log('Error: addCanvasElement can only be called in the Running state') }
  }

  function removeCanvasElement (element: any) {
    if (publicAPI.status === 'Running') { Module.qtRemoveCanvasElement(element) } else { console.log('Error: removeCanvasElement can only be called in the Running state') }
  }

  function resizeCanvasElement (element: any) {
    if (publicAPI.status === 'Running') { Module.qtResizeCanvasElement(element) }
  }

  setStatus('Created')

  return publicAPI
}
