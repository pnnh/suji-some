import React, { useEffect, useState } from 'react'

export default function TimestampPage () {
  const startUnix = Date.now()
  const [timeString, setTimeString] = useState<string>(new Date(startUnix).toUTCString())
  const [timestamp, setTimestamp] = useState<number>(Math.floor(startUnix / 1000))
  useEffect(() => {
    setInterval(() => {
      const nowUnix = Date.now()
      setTimestamp(Math.floor(nowUnix / 1000))
      setTimeString(new Date(nowUnix).toUTCString())
    }, 1000)
  }, [])

  return <div className={'timestamp-page'}>
    <div className={'content-body fx-card'}>
      <h2>
        现在的时间是
      </h2>
      <h3>
        {timeString}
      </h3>
      <h2>
        现在时间戳是
      </h2>
      <h3>
        {timestamp}
      </h3>
    </div>

  </div>
}
