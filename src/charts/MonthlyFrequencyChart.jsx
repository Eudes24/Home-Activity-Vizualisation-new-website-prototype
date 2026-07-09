import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from './useChartSize.js'
import useColorScheme, { chartTheme } from './useColorScheme.js'

export default function MonthlyFrequencyChart({ monthLabels, data, tooltip }) {
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

    const x = d3.scaleBand().domain(monthLabels).range([0, w]).padding(0.35)
    const y = d3.scaleLinear().domain([0, 35]).range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').attr('class', 'axis-y').call(d3.axisLeft(y).ticks(5).tickSize(0))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('class', 'axis-x').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')
      .attr('transform', 'rotate(-45)').style('text-anchor', 'end').attr('dx', '-4px').attr('dy', '2px')

    g.selectAll('.bar')
      .data(data.map((v, i) => ({ v, label: monthLabels[i] })))
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.label)).attr('width', x.bandwidth())
      .attr('y', (d) => y(d.v)).attr('height', (d) => h - y(d.v))
      .attr('rx', 3)
      .attr('fill', t.isDark ? '#185fa5' : '#b5d4f4')
      .attr('stroke', '#378add').attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, `${d.label}<br>${d.v} detections`))
      .on('mousemove', (event, d) => tooltip.show(event, `${d.label}<br>${d.v} detections`))
      .on('mouseleave', tooltip.hide)
  }, [width, height, isDark, monthLabels, data, tooltip])

  return (
    <div className="chart-box short" ref={containerRef}>
      <svg role="img" aria-label="Monthly detection frequency bar chart." />
    </div>
  )
}
