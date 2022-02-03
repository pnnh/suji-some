import React, {useState} from 'react'

import {Solar} from 'lunar-javascript'

function getLunar (date: Date) {
  // console.log('=============', date, date.getFullYear(), date.getMonth(), date.getDate())
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const lunar = solar.getLunar()
  // console.log(solar.toFullString())
  // console.log(lunar.toFullString())
  return lunar
}

function calcDays (date: Date, now: Date) {
  const nowMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  // console.log('nowMonth', nowMonth)
  let dayOfWeek = nowMonth.getDay()
  // console.log('dayofweek', dayOfWeek, 7 - dayOfWeek)
  if (dayOfWeek === 0) {
    dayOfWeek = 7
  }
  const startDate = new Date(nowMonth)
  startDate.setDate(startDate.getDate() - dayOfWeek + 1)
  // console.log('startDate', startDate)

  const dayElements: JSX.Element[] = []
  for (let i = 0; i < 42; i++) {
    const indexDate = new Date(startDate)
    indexDate.setDate(indexDate.getDate() + i)
    let className = 'day'
    if (indexDate.getMonth() === date.getMonth()) {
      className += ' current-month'
    }
    if (indexDate.getFullYear() === now.getFullYear() &&
      indexDate.getMonth() === now.getMonth() &&
      indexDate.getDate() === now.getDate()) {
      className += ' current-day'
    }
    const lunar = getLunar(indexDate)
    const element = <div key={indexDate.toISOString()}
                         className={className}>
      <div className={'area'}>
        {indexDate.getDate()}
      </div>
      <div className={'lunar'}>
        {lunar.getDayInChinese()}
      </div>
    </div>
    dayElements.push(element)
  }
  return <>{dayElements}</>
}

export function CalendarPage () {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<Date>(now)
  const calcYears = () => {
    const yearElements: JSX.Element[] = []
    for (let i = 0; i <= 200; i++) {
      const year = 1900 + i
      const element = <option key={'key' + year.toString()} value={year}>{year}月</option>
      yearElements.push(element)
    }
    return yearElements
  }

  function addMonth (month: number) {
    const date = new Date(selectedYear, selectedMonth - 1, 1)
    const newDate = new Date(date.setMonth(date.getMonth() + month))
    setSelectedYear(newDate.getFullYear())
    setSelectedMonth(newDate.getMonth() + 1)
    setSelectedDate(newDate)
  }

  function goToday () {
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth() + 1)
    setSelectedDate(now)
  }

  return <div className={'calendar-page'}>
    <div className={'content'}>
      <div className={'toolbar'}>
        <select className={'select-year'} value={selectedYear}
                onChange={(event => {
                  const year = Number(event.target.value)
                  setSelectedYear(year)
                  setSelectedDate(new Date(year, selectedMonth - 1, 1))
                })}>
          {calcYears()}
        </select>
        <i className="ri-arrow-left-s-line day-prev" onClick={() => addMonth(-1)}></i>
        <select className={'select-month'} value={selectedMonth}
                onChange={(event => {
                  const month = Number(event.target.value)
                  setSelectedMonth(month)
                  setSelectedDate(new Date(selectedYear, month - 1, 1))
                })}>
          <option value={1}>1月</option>
          <option value={2}>2月</option>
          <option value={3}>3月</option>
          <option value={4}>4月</option>
          <option value={5}>5月</option>
          <option value={6}>6月</option>
          <option value={7}>7月</option>
          <option value={8}>8月</option>
          <option value={9}>9月</option>
          <option value={10}>10月</option>
          <option value={11}>11月</option>
          <option value={12}>12月</option>
        </select>
        <i className="ri-arrow-right-s-line day-next" onClick={() => addMonth(1)}></i>
        <button className={'go-today'} onClick={() => goToday()}>返回今天</button>
      </div>
      <div className={'body'}>
        <div className={'week'}>一</div>
        <div className={'week'}>二</div>
        <div className={'week'}>三</div>
        <div className={'week'}>四</div>
        <div className={'week'}>五</div>
        <div className={'week'}>六</div>
        <div className={'week'}>日</div>
        {calcDays(selectedDate, now)}
      </div>
    </div>
  </div>
}
