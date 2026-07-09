import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from './useChartSize.js'
import useColorScheme, { chartTheme } from './useColorScheme.js'
import { drawGrid, drawAxes } from './chartHelpers.js'

export default function HourlyDistributionChart({ hours, data, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 8, bottom: 26, left: 26 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(hours).range([0, w]).padding(0.5)
    const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([h, 0])

    drawGrid(g, x, y, w, h, t.grid)
    drawAxes(g, x, y, w, h, t.tick, d3.format('d'), false, hours.filter((d, i) => i % 2 === 0))

    const area = d3.area().x((d, i) => x(hours[i])).y0(h).y1((d) => y(d)).curve(d3.curveBasis)
    const line = d3.line().x((d, i) => x(hours[i])).y((d) => y(d)).curve(d3.curveBasis)

    g.append('path').datum(data).attr('fill', t.fillArea).attr('d', area)
    g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#378add').attr('stroke-width', 2).attr('d', line)

    g.selectAll(null)
      .data(data.map((v, i) => ({ v, i })))
      .enter().append('circle')
      .attr('cx', (d) => x(hours[d.i])).attr('cy', (d) => y(d.v)).attr('r', 8).attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${hours[d.i]}<br>${d.v} detections`))
      .on('mousemove', (event, d) => tooltip.show(event, `${hours[d.i]}<br>${d.v} detections`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, hours, data, tooltip])

  return (
    <div className="chart-box short" ref={containerRef}>
      <svg role="img" aria-label="Hourly distribution of detections, peaking in the morning." />
    </div>
  )
}
