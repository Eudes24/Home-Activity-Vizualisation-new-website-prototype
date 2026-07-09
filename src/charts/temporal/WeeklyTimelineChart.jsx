import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import { ACTIVITY_TYPES, IDLE_COLOR } from '../../pages/temporalWeekData.js'

const ROW_HEIGHT = 30
const ROW_GAP = 10

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

      root.append('text')
        .attr('x', -10).attr('y', y + ROW_HEIGHT / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .attr('font-size', '11px').attr('fill', 'var(--color-text-secondary)')
        .text(dayRow.label)

      const clipId = `day-clip-${i}`
      root.append('clipPath').attr('id', clipId)
        .append('rect').attr('x', 0).attr('y', y).attr('width', w).attr('height', ROW_HEIGHT).attr('rx', ROW_HEIGHT / 2)

      const g = root.append('g').attr('clip-path', `url(#${clipId})`)

      g.selectAll('rect')
        .data(dayRow.segments)
        .enter().append('rect')
        .attr('x', (s) => x(s.start))
        .attr('y', y)
        .attr('width', (s) => Math.max(0, x(s.end) - x(s.start)))
        .attr('height', ROW_HEIGHT)
        .attr('fill', (s) => (s.type === 'idle' ? IDLE_COLOR : ACTIVITY_TYPES[s.type].color))
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
