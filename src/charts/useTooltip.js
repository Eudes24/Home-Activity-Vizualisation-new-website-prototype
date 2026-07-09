import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function useTooltip() {
  const tooltipRef = useRef(null)

  useEffect(() => {
    const div = d3.select(document.body)
      .append('div')
      .attr('class', 'd3-tooltip')
    tooltipRef.current = div
    return () => div.remove()
  }, [])

  const show = (event, html) => {
    tooltipRef.current
      ?.style('opacity', 1)
      .html(html)
      .style('left', `${event.clientX + 12}px`)
      .style('top', `${event.clientY - 30}px`)
  }

  const hide = () => {
    tooltipRef.current?.style('opacity', 0)
  }

  return { show, hide }
}
