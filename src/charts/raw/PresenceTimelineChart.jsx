import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme, { chartTheme } from '../useColorScheme.js'

const ANOMALY_COLOR = { critical: '#e24b4a', warning: '#e8c33c', moderate: '#e0973c' }

export default function PresenceTimelineChart({ months, data, anomalies, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 8, bottom: 26, left: 30 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(months).range([0, w]).padding(0.5)
    const y = d3.scaleLinear().domain([0, 100]).range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}%`).tickSize(0))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')
      .attr('transform', 'rotate(-45)').style('text-anchor', 'end').attr('dx', '-4px').attr('dy', '2px')

    const bandWidth = x.step() * 0.28
    anomalies.forEach((a) => {
      const cx = x(a.label)
      if (cx == null) return
      g.append('rect')
        .attr('x', cx - bandWidth / 2).attr('y', 0)
        .attr('width', bandWidth).attr('height', h)
        .attr('fill', ANOMALY_COLOR[a.type])
        .attr('opacity', 0.85)
        .style('cursor', 'pointer')
        .on('mouseenter', (event) => tooltip.show(event, `${a.label}<br>${a.type} anomaly`))
        .on('mousemove', (event) => tooltip.show(event, `${a.label}<br>${a.type} anomaly`))
        .on('mouseleave', tooltip.hide)
    })

    const area = d3.area().x((d) => x(d.label)).y0(h).y1((d) => y(d.value)).curve(d3.curveMonotoneX)
    const line = d3.line().x((d) => x(d.label)).y((d) => y(d.value)).curve(d3.curveMonotoneX)

    g.append('path').datum(data).attr('fill', 'rgba(78,167,104,0.18)').attr('d', area)
    g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#4ea768').attr('stroke-width', 2).attr('d', line)

    g.selectAll('.presence-dot')
      .data(data)
      .enter().append('circle')
      .attr('cx', (d) => x(d.label)).attr('cy', (d) => y(d.value)).attr('r', 3).attr('fill', '#4ea768')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${d.label}<br>${d.value}% presence`))
      .on('mousemove', (event, d) => tooltip.show(event, `${d.label}<br>${d.value}% presence`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, months, data, anomalies, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Home presence ratio over time, with anomaly periods highlighted." />
    </div>
  )
}
