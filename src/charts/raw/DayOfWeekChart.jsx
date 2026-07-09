import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme, { chartTheme } from '../useColorScheme.js'

export default function DayOfWeekChart({ data, tooltip }) {
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

    const x = d3.scaleBand().domain(data.map((d) => d.label)).range([0, w]).padding(0.35)
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).nice().range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0).tickFormat(d3.format('.2s')))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('x', (d) => x(d.label)).attr('width', x.bandwidth())
      .attr('y', (d) => y(d.value)).attr('height', (d) => h - y(d.value))
      .attr('rx', 3)
      .attr('fill', '#378add')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${d.label}<br>${d.value.toLocaleString()} detections`))
      .on('mousemove', (event, d) => tooltip.show(event, `${d.label}<br>${d.value.toLocaleString()} detections`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, data, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Detections by day of week." />
    </div>
  )
}
