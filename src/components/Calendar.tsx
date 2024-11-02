"use client";

import React, { useEffect, useMemo, useState, useCallback } from 'react';

type ComponentProps = {
  selected: [
    { day?: number, month?: number, year?: number },
    React.Dispatch<React.SetStateAction<
      { day?: number, month?: number, year?: number }
    >>
  ]
  default?: Date
  range?: {
    from?: Date
    to?: Date
  }
  highlights?: {
    from: Date
    to: Date
    class: string
  }[]
}

export default function Calendar(inputProps: ComponentProps) {
  const getZonedTime = () => {
    return new Date() // ignore time zone issue in this demo
  }
  const weekDayText = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const monthText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const defaultProps = {
    selected: useState({})
  }
  const props = { ...defaultProps, ...inputProps }
  const [selectedDate, setSelectedDate] = props.selected
  const [displayYear, setDisplayYear] = useState<number>(selectedDate.year ?? (props.default?.getFullYear() ?? props.range?.from?.getFullYear() ?? getZonedTime().getFullYear()))
  const [displayMonth, setDisplayMonth] = useState<number>(selectedDate.month ?? ((props.default?.getMonth() ?? props.range?.from?.getMonth() ?? getZonedTime().getMonth()) + 1)) // 1 - 12
  useEffect(() => {
    if (selectedDate.year) { setDisplayYear(selectedDate.year) }
    if (selectedDate.month) { setDisplayMonth(selectedDate.month) }
  }, [selectedDate])

  const inHighlight = useCallback(({ year, month, day }: {year: number, month: number, day: number | null}) => {
    if (!props.highlights || !day) { return '' }
    const targetDate = new Date(year, month - 1, day)
    for (const highlight of props.highlights) {
      let classStr = highlight.class
      if (highlight.from.toDateString() === targetDate.toDateString()) {
        classStr += ' rounded-l-full'
      }
      if (highlight.to.toDateString() === targetDate.toDateString()) {
        classStr += ' rounded-r-full'
      }
      if (
        highlight.from.toDateString() === targetDate.toDateString() ||
        (highlight.from.getTime() < targetDate.getTime() && highlight.to.getTime() > targetDate.getTime()) ||
        highlight.to.toDateString() === targetDate.toDateString()) {
        return classStr
      }
    }
    return undefined
  }, [props.highlights])

  const calendarMatrix = useMemo(() => {
    let weekDayForCurrent = new Date(displayYear, displayMonth - 1, 1).getDay() || 7 // 1-7, 1: Monday, 7: Sunday
    const daysInMonth = new Date(displayYear, displayMonth, 0).getDate() // -1 day on next month
    const matrix: {
      day: number
      hightlightClass: string | undefined
    }[][] = []
    for (const dayIdx of [...Array(daysInMonth).keys()]) {
      const day = dayIdx + 1
      if (day === 1 || weekDayForCurrent === 1 || matrix.length < 1) {
        matrix.push([])
      }
      matrix[matrix.length - 1][weekDayForCurrent - 1] = {
        day,
        hightlightClass: inHighlight({ year: displayYear, month: displayMonth, day })
      }
      weekDayForCurrent = weekDayForCurrent === 7 ? 1 : (weekDayForCurrent + 1)
    }
    return matrix
  }, [displayYear, displayMonth, inHighlight])

  const avaliableYears = () => {
    const years: number[] = []
    const currentYear = getZonedTime().getFullYear()
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }
    return years
  }
  const stepping = (step: number) => {
    if (isOutOfRangeStep(step)) { return }
    const target = stepMonth(step)
    setDisplayMonth(target.month)
    setDisplayYear(target.year)
  }
  const stepMonth = (step: number) => {
    let targetMonth = displayMonth + step
    let targetYear = displayYear
    if (targetMonth < 1) {
      targetMonth = 12
      targetYear -= 1
    } else if (targetMonth > 12) {
      targetMonth = 1
      targetYear += 1
    }
    return { month: targetMonth, year: targetYear }
  }
  const isOutOfRangeStep = (step: number) => {
    const target = stepMonth(step)
    const range = {
      from: props.range?.from ? props.range.from : new Date('1900 Jan 01'),
      to: props.range?.to ? props.range.to : new Date()
    }
    return (
      (
        range.from.getFullYear() > target.year ||
        (range.from.getFullYear() === target.year && range.from.getMonth() > (target.month - 1))
      ) ||
      (
        range.to.getFullYear() < target.year ||
        (range.to.getFullYear() === target.year && range.to.getMonth() < (target.month - 1))
      )
    )
  }

  const isActiveDate = ({ year, month, day }: {year: number, month: number, day: number | null}) => {
    if (!day || !selectedDate.year || !selectedDate.month || !selectedDate.day) { return false }
    return year === selectedDate.year && month === selectedDate.month && day === selectedDate.day
  }

  const isOutOfRangeDate = ({ year, month, day }: {year: number, month: number, day: number | null}) => {
    if (!day) { return true }
    const targetDate = new Date(year, month - 1, day)
    return (props.range?.from && props.range.from.getTime() > targetDate.getTime()) ||
      (props.range?.to && props.range.to.getTime() < targetDate.getTime())
  }
  const selectDate = ({ year, month, day }: {year: number, month: number, day: number | null}) => {
    if (!day || isOutOfRangeDate({ year, month, day }) || inHighlight({ year, month, day }) === undefined) { return }
    const res = { year, month, day }
    const targetDate = new Date(year, month - 1, day)
    if (
      (selectedDate.day === day && selectedDate.month === month && selectedDate.year === year) ||
      (props.range?.from && props.range.from.getTime() > targetDate.getTime()) ||
      (props.range?.to && props.range.to.getTime() < targetDate.getTime())
    ) {
      setSelectedDate({ day: undefined, month: undefined, year: undefined })
      return
    }
    setSelectedDate(res)
  }
  return (
    <div className="bg-white text-black rounded-[20px] text-center w-[277px] px-[12px] py-[20px]">
      <div className="inline-flex gap-[12px] items-center font-bold mb-[20px]">
        <button
          type="button"
          className={`cursor-pointer p-0 border-0 ${isOutOfRangeStep(-1) ? 'opacity-20' : ''}`}
          onClick={() => stepping(-1)}
        >
          {'<'}
        </button>
        <div className="w-[33px] text-center whitespace-nowrap">
          {props.range ?
            monthText[displayMonth - 1]
          :
            <select
              value={displayMonth}  onChange={e => setDisplayMonth(parseInt(e.target.value))}
              className="text-center bg-transparent p-0 appearance-none font-bold border-0"
            >
              {[...Array(12).keys()].map(month => {
                return (<option value={month + 1} key={`month-${month}}`}>
                  { monthText[month] }
                </option>)
              })}
            </select>
          }
        </div>
        <div className="w-[38px] text-center whitespace-nowrap">
          {props.range ?
            displayYear
          :
            <select
              value={displayYear} onChange={e => setDisplayYear(parseInt(e.target.value))}
              className="text-center bg-transparent p-0 appearance-none font-bold border-0"
            >
              {avaliableYears().map(year => (
                <option value={year} key={`year-${year}`}>
                  { year }
                </option>
              ))}
            </select>
          }
        </div>
        <button
          type="button"
          className={`cursor-pointer p-0 border-0 ${isOutOfRangeStep(1) ? 'opacity-20' : ''}`}
          onClick={() => stepping(1)}
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-[12px] text-center text-[15px] tracking-[-0.5px] whitespace-nowrap">
        {weekDayText.map(weekDay => (
          <div key={`weekDay-${weekDay}}`}>
            { weekDay }
          </div>
        ))}
        {calendarMatrix.map((week, i) => (
          <React.Fragment key={`${displayYear}-${displayMonth}-week-${i}`}>
            {Array.from(week, (dayObj, j) => (
              <button
                key={`${displayYear}-${displayMonth}-week-${i}-day-${dayObj?.day}-index-${j}`}
                className={`block text-center p-0 border-0 cursor-pointer leading-[1.7] ${
                  j > 4 ? 'text-gray-500' : dayObj?.hightlightClass !== undefined ? 'text-black' : 'text-gray-500'
                } ${
                  dayObj?.hightlightClass ? dayObj.hightlightClass : ''
                }`}
                onClick={() => selectDate({year: displayYear, month: displayMonth, day: dayObj?.day})}
                data-key={`${displayYear}-${displayMonth}-week-${i}-day-${dayObj?.day}-index-${j}`}
              >
                <div
                  className={`inline-block h-full w-auto rounded-full aspect-square ${
                    isActiveDate({year: displayYear, month: displayMonth, day: dayObj?.day})
                    ? (dayObj?.hightlightClass ? 'bg-white text-black' : 'bg-orange-500 text-black') : ''}`}
                >
                  { dayObj?.day }
                </div>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}