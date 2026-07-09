import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import { ACTIVITY_TYPES, IDLE_COLOR } from '../../pages/temporalWeekData.js'

const ROW_HEIGHT = 30
const ROW_GAP = 10
const CAP_RADIUS = ROW_HEIGHT / 2

function segmentPath(x0, x1, y, h, roundLeft, roundRight) {
  const r = Math.min(CAP_RADIUS, h / 2, Math.max(0, x1 - x0) / 2)
  const rl = roundLeft ? r : 0
  const rr = roundRight ? r : 0
  return [
    `M${x0 + rl},${y}`,
    `L${x1 - rr},${y}`,
    rr ? `A${rr},${rr} 0 0 1 ${x1},${y + rr}` : '',
    `L${x1},${y + h - rr}`,
    rr ? `A${rr},${rr} 0 0 1 ${x1 - rr},${y + h}` : '',
    `L${x0 + rl},${y + h}`,
    rl ? `A${rl},${rl} 0 0 1 ${x0},${y + h - rl}` : '',
    `L${x0},${y + rl}`,
    rl ? `A${rl},${rl} 0 0 1 ${x0 + rl},${y}` : '',
    'Z',
  ].filter(Boolean).join(' ')
}

export default function WeeklyTimelineChart({ weekData, selected, onSelect }) {
  const [containerRef, { width, height }] = useChartSize()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const margin = { top: 4, right: 6, bottom: 22, left: 78 }
    const w = width - margin.left - margin.right
    const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, 24]).range([0, w])
    const hourTicks = [0, 3, 6, 9, 12, 15, 18, 21, 24]
    const bottomY = weekData.length * (ROW_HEIGHT + ROW_GAP) - ROW_GAP + 8

    const xAxis = root.append('g')
      .attr('transform', `translate(0,${bottomY})`)
      .call(d3.axisBottom(x).tickValues(hourTicks).tickFormat((d) => String(d).padStart(2, '0')).tickSize(0))
    xAxis.selectAll('text').attr('fill', 'var(--color-text-secondary)').attr('font-size', '10px')
    xAxis.select('.domain').remove()

    weekData.forEach((dayRow, i) => {
      const y = i * (ROW_HEIGHT + ROW_GAP)
      const isSelectedDay = selected && selected.day === dayRow.label
      const lastIndex = dayRow.segments.length - 1

      root.append('text')
        .attr('x', -10).attr('y', y + ROW_HEIGHT / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .attr('font-size', '11px').attr('fill', 'var(--color-text-secondary)')
        .text(dayRow.label)

      root.selectAll(null)
        .data(dayRow.segments)
        .enter().append('path')
        .attr('d', (s, idx) => segmentPath(x(s.start), x(s.end), y, ROW_HEIGHT, idx === 0, idx === lastIndex))
        .attr('fill', (s) => (s.type === 'idle' ? IDLE_COLOR : ACTIVITY_TYPES[s.type].color))
        .attr('class', (s) => (s.type === 'idle' ? '' : 'segment-interactive'))
        .attr('stroke', (s) => (isSelectedDay && selected.start === s.start && selected.type === s.type ? 'var(--color-text-primary)' : 'none'))
        .attr('stroke-width', 2)
        .style('cursor', (s) => (s.type === 'idle' ? 'default' : 'pointer'))
        .on('click', (event, s) => {
          if (s.type === 'idle') return
          onSelect(dayRow.label, s)
        })
    })
  }, [width, height, weekData, selected, onSelect])

  const totalHeight = weekData.length * (ROW_HEIGHT + ROW_GAP) - ROW_GAP + 30

  return (
    <div className="chart-box timeline" ref={containerRef} style={{ height: totalHeight }}>
      <svg role="img" aria-label="Weekly activity timeline, Monday to Sunday, hours 0 to 24." />
    </div>
  )
}
