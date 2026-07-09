import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from './useChartSize.js'
import useColorScheme, { chartTheme } from './useColorScheme.js'
import { drawGrid, drawAxes, fmtHM } from './chartHelpers.js'

export default function StartTimeTrendChart({ months, data, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 8, bottom: 26, left: 34 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(months).range([0, w]).padding(0.5)
    const y = d3.scaleLinear().domain([420, 570]).range([h, 0])

    drawGrid(g, x, y, w, h, t.grid)
    drawAxes(g, x, y, w, h, t.tick, fmtHM, true)

    const line = d3.line().defined((d) => d != null).x((d, i) => x(months[i])).y((d) => y(d)).curve(d3.curveMonotoneX)

    g.append('path').datum(data.probable).attr('fill', 'none').attr('stroke', '#378add').attr('stroke-width', 2).attr('d', line)
    g.append('path').datum(data.weak).attr('fill', 'none').attr('stroke', '#888780').attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3').attr('d', line)

    ;[{ key: 'probable', color: '#378add', name: 'Probable' }, { key: 'weak', color: '#888780', name: 'Weak' }].forEach((s) => {
      g.selectAll(null)
        .data(data[s.key].map((v, i) => ({ v, i })).filter((d) => d.v != null))
        .enter().append('circle')
        .attr('cx', (d) => x(months[d.i])).attr('cy', (d) => y(d.v)).attr('r', 2.5).attr('fill', s.color)
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => tooltip.show(event, `${s.name} · ${months[d.i]}<br>${fmtHM(d.v)}`))
        .on('mousemove', (event, d) => tooltip.show(event, `${s.name} · ${months[d.i]}<br>${fmtHM(d.v)}`))
        .on('mouseleave', tooltip.hide)
    })

    g.selectAll(null)
      .data(data.failure.map((v, i) => ({ v, i })).filter((d) => d.v != null))
      .enter().append('line')
      .attr('x1', (d) => x(months[d.i])).attr('x2', (d) => x(months[d.i]))
      .attr('y1', (d) => y(d.v) - 7).attr('y2', (d) => y(d.v) + 7)
      .attr('stroke', '#e24b4a').attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `Failure · ${months[d.i]}`))
      .on('mousemove', (event, d) => tooltip.show(event, `Failure · ${months[d.i]}`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, months, data, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Start time trend over time, with failures marked in red." />
    </div>
  )
}
