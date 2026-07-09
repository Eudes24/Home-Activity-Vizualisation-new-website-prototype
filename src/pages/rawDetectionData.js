function mulberry32(seed) {
  return function rand() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

export const months = ['Nov 16', 'Dec 16', 'Jan 17', 'Feb 17', 'Mar 17', 'Apr 17', 'May 17', 'Jun 17', 'Jul 17', 'Aug 17', 'Sep 17', 'Oct 17', 'Nov 17', 'Dec 17']

const startDate = new Date(2016, 10, 1)
const endDate = new Date(2017, 11, 31)

export const dailyDetections = []
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const monthProgress = (d.getFullYear() - 2016) * 12 + d.getMonth() - 10
  const base = 560 + 130 * Math.sin((monthProgress / 14) * Math.PI * 1.4)
  const noise = (rand() - 0.5) * 260
  const spike = rand() > 0.965 ? rand() * 420 : 0
  const value = Math.max(15, Math.round(base + noise + spike))
  dailyDetections.push({ date: new Date(d), value })
}

export const totalDetections = dailyDetections.reduce((sum, d) => sum + d.value, 0)
export const meanPerDay = Math.round(totalDetections / dailyDetections.length)

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

const monthTotalsMap = new Map()
for (const { date, value } of dailyDetections) {
  const key = monthKey(date)
  monthTotalsMap.set(key, (monthTotalsMap.get(key) || 0) + value)
}

export const monthlyTotals = []
for (let i = 0; i < months.length; i++) {
  const date = new Date(2016, 10 + i, 1)
  const key = monthKey(date)
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  monthlyTotals.push({
    label: months[i],
    total: monthTotalsMap.get(key) || 0,
    daysInMonth,
  })
}

export const cumulativeDetections = (() => {
  let running = 0
  return monthlyTotals.map((m) => {
    running += m.total
    return { label: m.label, value: running }
  })
})()

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekdayTotals = new Array(7).fill(0)
for (const { date, value } of dailyDetections) {
  const jsDay = date.getDay()
  const idx = jsDay === 0 ? 6 : jsDay - 1
  weekdayTotals[idx] += value
}
export const detectionsByWeekday = WEEKDAY_LABELS.map((label, i) => ({ label, value: weekdayTotals[i] }))

export const hours = Array.from({ length: 24 }, (_, h) => h)
export const detectionsByHour = hours.map((h) => {
  const morning = 620 * Math.exp(-((h - 10) ** 2) / 12)
  const afternoon = 480 * Math.exp(-((h - 15) ** 2) / 18)
  const nightFloor = 25
  return Math.round(morning + afternoon + nightFloor)
})

export const roomBreakdown = [
  { label: 'Kitchen', pct: 43.6, color: '#378add' },
  { label: 'Bedroom', pct: 34.8, color: '#4ea768' },
  { label: 'Living room', pct: 12.7, color: '#e0a63c' },
  { label: 'Bathroom', pct: 8.9, color: '#e0768a' },
].map((r) => ({ ...r, count: Math.round((r.pct / 100) * totalDetections) }))

export const presenceRatio = monthlyTotals.map((m, i) => ({
  label: m.label,
  value: Math.round(72 + 18 * Math.sin(i / 2.3) + (rand() - 0.5) * 8),
}))

export const presenceAnomalies = [
  { label: 'Jan 17', type: 'critical' },
  { label: 'Apr 17', type: 'warning' },
  { label: 'Jul 17', type: 'moderate' },
  { label: 'Oct 17', type: 'moderate' },
]

export const timeDistribution = [
  { label: 'Time inside', pct: 63, color: '#378add' },
  { label: 'Outings', pct: 27, color: '#4ea768' },
  { label: 'Failures', pct: 10, color: '#e0a63c' },
]
export const totalHours = 8760

export function fmtHoursMinutes(hoursFloat) {
  const h = Math.floor(hoursFloat)
  const m = Math.round((hoursFloat - h) * 60)
  return `${h}h${m ? String(m).padStart(2, '0') + 'm' : ''}`
}

export const summaryRows = monthlyTotals.map((m, i) => {
  const avgPerDay = m.total / m.daysInMonth
  const presencePct = presenceRatio[i].value
  const timeInsideAvg = (presencePct / 100) * 24
  return {
    label: m.label,
    detections: m.total,
    avgPerDay: Math.round(avgPerDay),
    timeInsideAvg: fmtHoursMinutes(timeInsideAvg),
  }
})

export const summaryTotals = {
  detections: totalDetections,
  avgPerDay: meanPerDay,
  timeInsideAvg: fmtHoursMinutes((summaryRows.reduce((s, r) => s + presenceRatio.find((p) => p.label === r.label).value, 0) / summaryRows.length / 100) * 24),
}

export const calendarHeatmap = (() => {
  const byMonth = new Map()
  for (const { date, value } of dailyDetections) {
    const key = monthKey(date)
    if (!byMonth.has(key)) byMonth.set(key, new Array(31).fill(null))
    byMonth.get(key)[date.getDate() - 1] = value
  }
  const max = Math.max(...dailyDetections.map((d) => d.value))
  return months.map((label, i) => {
    const date = new Date(2016, 10 + i, 1)
    const key = monthKey(date)
    return { label, days: byMonth.get(key) || new Array(31).fill(null) }
  }).reduce((acc, row) => {
    acc.rows.push(row)
    return acc
  }, { rows: [], max })
})()
