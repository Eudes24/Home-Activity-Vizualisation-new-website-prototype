import { useState, useEffect } from 'react'
import { CalendarIcon } from './icons.jsx'
import { sameDate, fmtISODate, parseISODate } from '../pages/temporalWeekData.js'
import './DayPicker.css'

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const WEEKDAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function MiniCalendar({ displayedMonth, onShiftMonth, selectedDate, onSelect, minDate, maxDate }) {
  const year = displayedMonth.getFullYear()
  const month = displayedMonth.getMonth()
  const monthLabel = displayedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7
  const cells = [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const prevDisabled = startOfMonth(displayedMonth) <= startOfMonth(minDate)
  const nextDisabled = startOfMonth(displayedMonth) >= startOfMonth(maxDate)

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button type="button" onClick={() => onShiftMonth(-1)} disabled={prevDisabled} aria-label="Previous month">‹</button>
        <span className="mini-calendar-month">{monthLabel}</span>
        <button type="button" onClick={() => onShiftMonth(1)} disabled={nextDisabled} aria-label="Next month">›</button>
      </div>
      <div className="mini-calendar-weekdays">
        {WEEKDAY_HEADERS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="mini-calendar-grid">
        {cells.map((cellDay, i) => {
          if (cellDay == null) return <span key={i} className="mini-calendar-cell empty" />
          const cellDate = new Date(year, month, cellDay)
          const inRange = cellDate >= minDate && cellDate <= maxDate
          const isSelected = sameDate(cellDate, selectedDate)
          return (
            <button
              key={i}
              type="button"
              className={`mini-calendar-cell${inRange ? ' available' : ''}${isSelected ? ' selected' : ''}`}
              disabled={!inRange}
              onClick={() => onSelect(cellDate)}
            >
              {cellDay}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DayPicker({ selectedDate, onChange, weekLabel, eventCount, minDate, maxDate }) {
  const [open, setOpen] = useState(false)
  const [displayedMonth, setDisplayedMonth] = useState(() => startOfMonth(selectedDate))
  const [dateText, setDateText] = useState(() => fmtISODate(selectedDate))
  const [error, setError] = useState(null)

  useEffect(() => {
    setDateText(fmtISODate(selectedDate))
    setError(null)
  }, [selectedDate])

  const openPicker = () => {
    setDisplayedMonth(startOfMonth(selectedDate))
    setOpen((v) => !v)
  }

  const handleSelect = (date) => {
    onChange(date)
    setOpen(false)
  }

  const shiftDay = (delta) => {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + delta)
    onChange(next)
  }

  const commitTypedDate = () => {
    const text = dateText.trim()
    if (!ISO_DATE_RE.test(text)) {
      setError('Invalid format, use YYYY-MM-DD')
      return
    }
    const parsed = parseISODate(text)
    if (!parsed) {
      setError('This date does not exist')
      return
    }
    if (parsed < minDate || parsed > maxDate) {
      setError(`Date must be between ${fmtISODate(minDate)} and ${fmtISODate(maxDate)}`)
      return
    }
    setError(null)
    onChange(parsed)
  }

  return (
    <div className="card day-picker-card">
      <div className="day-picker-row">
        <button
          type="button"
          className="day-picker-nav-btn"
          onClick={() => shiftDay(-1)}
          disabled={sameDate(selectedDate, minDate)}
          aria-label="Previous day"
        >
          ‹
        </button>

        <div className="day-picker-display-row">
          <input
            type="text"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            className={`day-picker-date-input${error ? ' invalid' : ''}`}
            value={dateText}
            onChange={(e) => { setDateText(e.target.value); setError(null) }}
            onBlur={commitTypedDate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Return') { commitTypedDate(); e.currentTarget.blur() }
              if (e.key === 'Escape') { setDateText(fmtISODate(selectedDate)); setError(null) }
            }}
            aria-label="Selected date, format year month day"
            aria-invalid={!!error}
            aria-describedby={error ? 'day-picker-error' : undefined}
          />
          <span className="day-picker-week-badge">{weekLabel}</span>
          <button
            type="button"
            className="day-picker-calendar-btn"
            onClick={openPicker}
            aria-label="Pick a date"
            aria-expanded={open}
          >
            <CalendarIcon />
          </button>

          {open && (
            <div className="day-picker-popover">
              <MiniCalendar
                displayedMonth={displayedMonth}
                onShiftMonth={(delta) => setDisplayedMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))}
                selectedDate={selectedDate}
                onSelect={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="day-picker-nav-btn"
          onClick={() => shiftDay(1)}
          disabled={sameDate(selectedDate, maxDate)}
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {error && <div id="day-picker-error" className="day-picker-error" role="alert">{error}</div>}

      <div className="day-picker-status">
        <span className="status-ok">✓ {eventCount} events loaded</span>
        <span className="status-range">· Data available Nov 2016 – Dec 2017</span>
      </div>
    </div>
  )
}
