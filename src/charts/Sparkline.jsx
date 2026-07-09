import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function Sparkline({ data, width = 70, height = 24, color = '#378add' }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([1, width - 1])
    const y = d3.scaleLinear().domain(d3.extent(data)).range([height - 2, 2])
    const line = d3.line().x((_, i) => x(i)).y((d) => y(d)).curve(d3.curveMonotoneX)

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.4)
      .attr('d', line)
  }, [data, width, height, color])

  return <svg ref={svgRef} width={width} height={height} style={{ display: 'block' }} />
}
