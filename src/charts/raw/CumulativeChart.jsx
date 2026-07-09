import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme, { chartTheme } from '../useColorScheme.js'

export default function CumulativeChart({ months, data, tooltip }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 46, bottom: 22, left: 40 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(months).range([0, w]).padding(0.5)
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).nice().range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('.2s')).tickSize(0))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues(months.filter((_, i) => i % 2 === 0)).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const line = d3.line().x((d) => x(d.label)).y((d) => y(d.value)).curve(d3.curveMonotoneX)
    g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#4ea768').attr('stroke-width', 2).attr('d', line)

    g.selectAll('.pt')
      .data(data)
      .enter().append('circle')
      .attr('cx', (d) => x(d.label)).attr('cy', (d) => y(d.value)).attr('r', 2.5).attr('fill', '#4ea768')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${d.label}<br>${d.value.toLocaleString()} cumulative`))
      .on('mousemove', (event, d) => tooltip.show(event, `${d.label}<br>${d.value.toLocaleString()} cumulative`))
      .on('mouseleave', tooltip.hide)

    const last = data[data.length - 1]
    const badge = g.append('g').attr('transform', `translate(${x(last.label)},${y(last.value)})`)
    badge.append('rect')
      .attr('x', 8).attr('y', -11).attr('height', 22).attr('rx', 11)
      .attr('fill', '#4ea768')
      .attr('width', String(last.value.toLocaleString()).length * 6.5 + 16)
    badge.append('text')
      .attr('x', 16).attr('y', 4)
      .attr('fill', '#fff').attr('font-size', '11px').attr('font-weight', 600)
      .text(last.value.toLocaleString())
  }, [width, height, isDark, months, data, tooltip])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Cumulative detections over time." />
    </div>
  )
}
