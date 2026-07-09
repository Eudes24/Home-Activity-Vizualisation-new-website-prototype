import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme from '../useColorScheme.js'

export default function CalendarHeatmap({ rows, max, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const margin = { top: 4, right: 4, bottom: 4, left: 34 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand().domain(d3.range(31)).range([0, w]).padding(0.12)
    const y = d3.scaleBand().domain(rows.map((r) => r.label)).range([0, h]).padding(0.12)
    const color = d3.scaleSequential(isDark ? d3.interpolateBlues : d3.interpolateBlues).domain([0, max])

    const yAxis = g.append('g').call(d3.axisLeft(y).tickSize(0))
    yAxis.selectAll('text').attr('fill', 'var(--color-text-secondary)').attr('font-size', '9px')
    yAxis.select('.domain').remove()

    rows.forEach((row) => {
      g.selectAll(`.cell-${row.label.replace(/\s/g, '')}`)
        .data(row.days.map((value, day) => ({ value, day })))
        .enter().append('rect')
        .attr('x', (d) => x(d.day))
        .attr('y', y(row.label))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 1.5)
        .attr('fill', (d) => (d.value == null ? 'transparent' : color(d.value)))
        .style('cursor', (d) => (d.value == null ? 'default' : 'pointer'))
        .on('mouseenter', (event, d) => {
          if (d.value == null) return
          tooltip.show(event, `${row.label} ${d.day + 1}<br>${d.value} detections`)
        })
        .on('mousemove', (event, d) => {
          if (d.value == null) return
          tooltip.show(event, `${row.label} ${d.day + 1}<br>${d.value} detections`)
        })
        .on('mouseleave', tooltip.hide)
    })
  }, [width, height, isDark, rows, max, tooltip])

  return (
    <div className="chart-box heatmap" ref={containerRef}>
      <svg role="img" aria-label="Detections heatmap, month by day of the month." />
    </div>
  )
}
