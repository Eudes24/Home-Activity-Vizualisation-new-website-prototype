import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from './useChartSize.js'
import useColorScheme, { chartTheme } from './useColorScheme.js'
import { drawGrid, drawAxes, fmtMin } from './chartHelpers.js'

export default function DailySpreadChart({ months, data, tooltip }) {
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
    const y = d3.scaleLinear().domain([0, 45]).range([h, 0])

    drawGrid(g, x, y, w, h, t.grid)
    drawAxes(g, x, y, w, h, t.tick, fmtMin, true)

    const area = d3.area().defined((d) => d != null).x((d, i) => x(months[i])).y0(h).y1((d) => y(d)).curve(d3.curveMonotoneX)
    const line = d3.line().defined((d) => d != null).x((d, i) => x(months[i])).y((d) => y(d)).curve(d3.curveMonotoneX)

    g.append('path').datum(data.startTime).attr('fill', t.fillArea).attr('d', area)
    g.append('path').datum(data.startTime).attr('fill', 'none').attr('stroke', '#378add').attr('stroke-width', 2).attr('d', line)

    g.selectAll(null)
      .data(data.startTime.map((v, i) => ({ v, i })))
      .enter().append('circle')
      .attr('cx', (d) => x(months[d.i])).attr('cy', (d) => y(d.v)).attr('r', 3).attr('fill', '#378add')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `Start time · ${months[d.i]}<br>${fmtMin(d.v)}`))
      .on('mousemove', (event, d) => tooltip.show(event, `Start time · ${months[d.i]}<br>${fmtMin(d.v)}`))
      .on('mouseleave', tooltip.hide)

    g.selectAll(null)
      .data(data.failure.map((v, i) => ({ v, i })).filter((d) => d.v != null))
      .enter().append('rect')
      .attr('width', 8).attr('height', 8).attr('fill', '#e24b4a')
      .attr('transform', (d) => `translate(${x(months[d.i])},${y(d.v)}) rotate(45)`)
      .attr('x', -4).attr('y', -4)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `Failure · ${months[d.i]}`))
      .on('mousemove', (event, d) => tooltip.show(event, `Failure · ${months[d.i]}`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, months, data, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Detection start time daily spread, with failures marked in red." />
    </div>
  )
}
