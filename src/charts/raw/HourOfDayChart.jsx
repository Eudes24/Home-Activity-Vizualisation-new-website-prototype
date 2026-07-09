import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme, { chartTheme } from '../useColorScheme.js'

export default function HourOfDayChart({ hours, data, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 8, bottom: 22, left: 32 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const labels = hours.map((h) => String(h).padStart(2, '0'))
    const x = d3.scaleBand().domain(labels).range([0, w]).padding(0.25)
    const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues(labels.filter((_, i) => i % 2 === 0)).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '9px')

    g.selectAll('.bar')
      .data(data.map((v, i) => ({ v, label: labels[i] })))
      .enter().append('rect')
      .attr('x', (d) => x(d.label)).attr('width', x.bandwidth())
      .attr('y', (d) => y(d.v)).attr('height', (d) => h - y(d.v))
      .attr('rx', 2)
      .attr('fill', '#378add')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${d.label}:00<br>${d.v} detections (mean)`))
      .on('mousemove', (event, d) => tooltip.show(event, `${d.label}:00<br>${d.v} detections (mean)`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, hours, data, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Detections by hour of day, mean values." />
    </div>
  )
}
