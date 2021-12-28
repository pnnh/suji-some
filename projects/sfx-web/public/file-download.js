const m = 1024 * 1024 * 10 // 分片大小
// const url = 'https://vodm0pihssv.vod.126.net/edu-video/nos/mp4/2017/10/10/1007299069_2cddd54a92e344639ad9669a2e0109ed_sd.mp4' // 下载url
const url = 'https://res.sfx.xyz/wasm/qt-canvas.wasm'
const donwloadName = 'qt-canvas' // 下载文件名
const script = document.createElement('script')
script.src = 'https://cdn.bootcss.com/axios/0.19.2/axios.min.js'
document.body.appendChild(script)

function downloadDirect (url) {
  console.time('直接下载1')
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'blob'
  req.onload = function (oEvent) {
    const content = req.response
    const aTag = document.createElement('a')
    aTag.download = donwloadName
    const blob = new Blob([content])
    const blobUrl = URL.createObjectURL(blob)
    aTag.href = blobUrl
    aTag.click()
    URL.revokeObjectURL(blob)
    console.timeEnd('直接下载1')
  }
  req.send()
}

function downloadConcurrent (url) {
// 多线程下载
  axios({
    url,
    method: 'head'
  }).then((res) => {
    console.time('并发下载1')
    const size = Number(res.headers['content-length'])
    const length = parseInt(size / m)
    const arr = []
    let count = 0
    function downloadRange (url, start, end, i) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.setRequestHeader('range', `bytes=${start}-${end}`)
        req.responseType = 'blob'
        req.onload = function (oEvent) {
          req.response.arrayBuffer().then((res) => {
            count++
            console.log(`下载百分比${((count / length) * 100).toFixed(2)}`)
            resolve({
              i,
              buffer: res
            })
          })
        }
        req.send()
      })
    }
    // 合并buffer
    function concatenate (resultConstructor, arrays) {
      let totalLength = 0
      for (const arr of arrays) {
        totalLength += arr.length
      }
      const result = new resultConstructor(totalLength)
      let offset = 0
      for (const arr of arrays) {
        result.set(arr, offset)
        offset += arr.length
      }
      return result
    }

    for (let i = 0; i <= length; i++) {
      const start = i * m
      const end = (i == length) ? size - 1 : (i + 1) * m - 1
      arr.push(downloadRange(url, start, end, i))
    }
    Promise.all(arr).then((res) => {
      const arrBufferList = res
        .sort((item) => item.i - item.i)
        .map((item) => new Uint8Array(item.buffer))
      count = 0
      const allBuffer = concatenate(Uint8Array, arrBufferList)
      const blob = new Blob([allBuffer], { type: 'image/jpeg' })
      const blobUrl = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.download = donwloadName
      aTag.href = blobUrl
      aTag.click()
      URL.revokeObjectURL(blob)
      console.timeEnd('并发下载1')
    })
  })
}

function downloadSplit (url, len) {
  console.time('downloadSplit')
  const arr = []
  let count = 0
  function downloadRange (url, suffix) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.open('GET', url + suffix, true)
      req.responseType = 'blob'
      req.onload = function (oEvent) {
        req.response.arrayBuffer().then((res) => {
          count++
          console.log(`分片下载完成: ${suffix} 字节: ${res.length}`)
          resolve({
            buffer: res
          })
        })
      }
      req.send()
    })
  }
  // 合并buffer
  function concatenate (resultConstructor, arrays) {
    let totalLength = 0
    for (const arr of arrays) {
      totalLength += arr.length
    }
    const result = new resultConstructor(totalLength)
    let offset = 0
    for (const arr of arrays) {
      result.set(arr, offset)
      offset += arr.length
    }
    return result
  }

  const splits = ['a', 'b', 'c', 'd', 'e']
  for (const k in splits) {
    if (k >= len || k >= splits.length) { break }
    arr.push(downloadRange(url, '.a' + splits[k] + '.br'))
  }

  Promise.all(arr).then((res) => {
    const arrBufferList = res
      .sort((item) => item.i - item.i)
      .map((item) => new Uint8Array(item.buffer))
    count = 0
    const allBuffer = concatenate(Uint8Array, arrBufferList)
    const blob = new Blob([allBuffer], { type: 'image/jpeg' })
    const blobUrl = URL.createObjectURL(blob)
    const aTag = document.createElement('a')
    aTag.download = donwloadName
    aTag.href = blobUrl
    aTag.click()
    URL.revokeObjectURL(blob)
    console.timeEnd('downloadSplit')
  })
}

// 直接下载
downloadDirect(url)

// 并发下载
// downloadConcurrent(url)

downloadSplit(url, 5)
