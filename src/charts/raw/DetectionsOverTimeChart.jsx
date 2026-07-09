import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from '../useChartSize.js'
import useColorScheme, { chartTheme } from '../useColorScheme.js'

export default function DetectionsOverTimeChart({ data }) {
  const [containerRef, { width, height }] = useChartSize()
  const isDark = useColorScheme()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()
    const t = chartTheme(isDark)
    const margin = { top: 8, right: 10, bottom: 22, left: 32 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleTime().domain(d3.extent(data, (d) => d.date)).range([0, w])
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).nice().range([h, 0])

    g.append('g').attr('class', 'grid-y')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
      .call((sel) => sel.selectAll('line').attr('stroke', t.grid))

    const yAxis = g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0))
    yAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const xAxis = g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(2)).tickFormat(d3.timeFormat('%b %y')).tickSize(0))
    xAxis.selectAll('text').attr('fill', t.tick).attr('font-size', '10px')

    const line = d3.line().x((d) => x(d.date)).y((d) => y(d.value)).curve(d3.curveLinear)

    g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#378add').attr('stroke-width', 1.2).attr('d', line)
  }, [width, height, isDark, data])

  return (
    <div className="chart-box" ref={containerRef}>
      <svg role="img" aria-label="Detections over time, daily counts from November 2016 to December 2017." />
    </div>
  )
}
