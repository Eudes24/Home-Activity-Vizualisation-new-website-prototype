import { useEffect } from 'react'
import * as d3 from 'd3'
import useChartSize from './useChartSize.js'

export default function DonutChart({ data, centerValue, centerLabel, tooltip, formatTooltip }) {
  const [containerRef, { width, height }] = useChartSize()

  useEffect(() => {
    if (!width || !height) return
    const svg = d3.select(containerRef.current).select('svg')
    svg.selectAll('*').remove()

    const size = Math.min(width, height)
    const radius = size / 2
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    const pie = d3.pie().value((d) => d.pct).sort(null)
    const arc = d3.arc().innerRadius(radius * 0.62).outerRadius(radius * 0.98).cornerRadius(2).padAngle(0.015)

    g.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => tooltip.show(event, formatTooltip ? formatTooltip(d.data) : `${d.data.label}<br>${d.data.pct}%`))
      .on('mousemove', (event, d) => tooltip.show(event, formatTooltip ? formatTooltip(d.data) : `${d.data.label}<br>${d.data.pct}%`))
      .on('mouseleave', tooltip.hide)

    if (centerValue) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.2em')
        .attr('font-size', Math.max(13, radius * 0.24))
        .attr('font-weight', 600)
        .attr('fill', 'var(--color-text-primary)')
        .text(centerValue)
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.3em')
        .attr('font-size', Math.max(9, radius * 0.14))
        .attr('fill', 'var(--color-text-secondary)')
        .text(centerLabel || '')
    }
  }, [width, height, data, centerValue, centerLabel, tooltip, formatTooltip])

  return (
    <div className="donut-layout">
      <div className="donut-chart-box" ref={containerRef}>
        <svg role="img" aria-label={centerLabel} />
      </div>
      <ul className="donut-legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="donut-legend-label">{d.label}</span>
            <span className="donut-legend-value">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
