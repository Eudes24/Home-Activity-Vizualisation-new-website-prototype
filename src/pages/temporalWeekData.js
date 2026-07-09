export const ACTIVITY_TYPES = {
  sleep: { label: 'Sleep', color: '#8ec6f2' },
  meals: { label: 'Meals', color: '#e8a33c' },
  outings: { label: 'Outings', color: '#4ea768' },
  bathroom: { label: 'Bathroom', color: '#1f3f8f' },
}

export const IDLE_COLOR = '#e4e4e7'

export const SENSOR_TYPES = {
  contact: { label: 'Contact sensor', color: '#378add' },
  electrical: { label: 'Electrical usage sensor', color: '#e24b4a' },
  motion: { label: 'Motion sensor', color: '#4ea768' },
}

export const SENSOR_RULES = {
  sleep: [
    { name: 'Bed contact sensor', type: 'contact' },
    { name: 'Bedroom motion sensor', type: 'motion' },
    { name: 'Nightlight usage sensor', type: 'electrical' },
  ],
  meals: [
    { name: 'Fridge door sensor', type: 'contact' },
    { name: 'Kitchen motion sensor', type: 'motion' },
    { name: 'Stove usage sensor', type: 'electrical' },
  ],
  outings: [
    { name: 'Front door contact sensor', type: 'contact' },
    { name: 'Entryway motion sensor', type: 'motion' },
    { name: 'Alarm system sensor', type: 'electrical' },
  ],
  bathroom: [
    { name: 'Bathroom door sensor', type: 'contact' },
    { name: 'Bathroom motion sensor', type: 'motion' },
    { name: 'Bathroom light usage sensor', type: 'electrical' },
  ],
}

function day(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start)
  const segments = []
  let cursor = 0
  for (const e of sorted) {
    if (e.start > cursor) segments.push({ start: cursor, end: e.start, type: 'idle' })
    segments.push(e)
    cursor = e.end
  }
  if (cursor < 24) segments.push({ start: cursor, end: 24, type: 'idle' })
  return segments
}

export const weekLabel = 'Week 21'

export const weekData = [
  {
    label: 'Monday',
    segments: day([
      { start: 0, end: 6.5, type: 'sleep' },
      { start: 6.5, end: 6.65, type: 'bathroom' },
      { start: 7.3, end: 7.6, type: 'meals' },
      { start: 8.9, end: 9.0, type: 'bathroom' },
      { start: 11.6, end: 12.1, type: 'meals' },
      { start: 14.8, end: 16.3, type: 'outings' },
      { start: 16.6, end: 16.7, type: 'bathroom' },
      { start: 20.6, end: 21.0, type: 'meals' },
      { start: 21.3, end: 21.4, type: 'bathroom' },
      { start: 21.4, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Tuesday',
    segments: day([
      { start: 0, end: 6.2, type: 'sleep' },
      { start: 6.2, end: 6.35, type: 'bathroom' },
      { start: 7.1, end: 7.4, type: 'meals' },
      { start: 9.4, end: 9.5, type: 'bathroom' },
      { start: 9.6, end: 9.75, type: 'bathroom' },
      { start: 12.0, end: 12.5, type: 'meals' },
      { start: 15.6, end: 15.75, type: 'bathroom' },
      { start: 18.6, end: 20.6, type: 'outings' },
      { start: 21.0, end: 21.4, type: 'meals' },
      { start: 21.6, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Wednesday',
    segments: day([
      { start: 0, end: 6.4, type: 'sleep' },
      { start: 6.4, end: 6.55, type: 'bathroom' },
      { start: 8.7, end: 8.95, type: 'meals' },
      { start: 12.3, end: 12.7, type: 'meals' },
      { start: 13.6, end: 13.75, type: 'bathroom' },
      { start: 16.9, end: 17.2, type: 'meals' },
      { start: 20.4, end: 20.55, type: 'bathroom' },
      { start: 20.9, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Thursday',
    segments: day([
      { start: 0, end: 6.3, type: 'sleep' },
      { start: 6.3, end: 6.45, type: 'bathroom' },
      { start: 7.2, end: 7.5, type: 'meals' },
      { start: 12.1, end: 12.6, type: 'meals' },
      { start: 15.5, end: 15.65, type: 'bathroom' },
      { start: 17.8, end: 18.0, type: 'bathroom' },
      { start: 19.4, end: 19.8, type: 'meals' },
      { start: 21.2, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Friday',
    segments: day([
      { start: 0, end: 6.6, type: 'sleep' },
      { start: 6.6, end: 6.75, type: 'bathroom' },
      { start: 7.4, end: 7.65, type: 'meals' },
      { start: 9.9, end: 10.0, type: 'bathroom' },
      { start: 13.9, end: 14.15, type: 'meals' },
      { start: 17.5, end: 17.6, type: 'bathroom' },
      { start: 20.7, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Saturday',
    segments: day([
      { start: 0, end: 5.6, type: 'sleep' },
      { start: 5.6, end: 5.75, type: 'bathroom' },
      { start: 5.9, end: 6.15, type: 'bathroom' },
      { start: 6.6, end: 6.9, type: 'meals' },
      { start: 11.5, end: 15.6, type: 'outings' },
      { start: 16.0, end: 16.3, type: 'meals' },
      { start: 21.0, end: 21.15, type: 'bathroom' },
      { start: 21.4, end: 24, type: 'sleep' },
    ]),
  },
  {
    label: 'Sunday',
    segments: day([
      { start: 0, end: 6.35, type: 'sleep' },
      { start: 6.35, end: 6.5, type: 'bathroom' },
      { start: 8.6, end: 8.9, type: 'meals' },
      { start: 11.9, end: 12.1, type: 'bathroom' },
      { start: 15.9, end: 16.2, type: 'meals' },
      { start: 18.2, end: 18.9, type: 'bathroom' },
      { start: 20.6, end: 24, type: 'sleep' },
    ]),
  },
]

export function fmtTime(hoursFloat) {
  const h = Math.floor(hoursFloat)
  const m = Math.round((hoursFloat - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function fmtDuration(hoursFloat) {
  const totalMinutes = Math.round(hoursFloat * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  return m ? `${h}h${String(m).padStart(2, '0')}m` : `${h}h`
}

export function weeklyTotals() {
  const totals = { sleep: 0, meals: 0, outings: 0, bathroom: 0 }
  for (const { segments } of weekData) {
    for (const seg of segments) {
      if (seg.type === 'idle') continue
      totals[seg.type] += seg.end - seg.start
    }
  }
  return totals
}

export const transitionsThisWeek = 214

export const sleepMetrics = {
  duration: { value: '7h47', deltaMinutes: -32, avg: 'avg 8h19' },
  bedtime: { value: '23:28', deltaMinutes: 30, avg: 'avg 22:58' },
  wakeTime: { value: '07:18', deltaMinutes: 6, avg: 'avg 07:12' },
  awakenings: { value: '14', deltaMinutes: 6, avg: 'avg 2/night' },
}

export const anomalies = [{ label: 'Missed meal', detail: 'Friday', color: ACTIVITY_TYPES.meals.color }]
