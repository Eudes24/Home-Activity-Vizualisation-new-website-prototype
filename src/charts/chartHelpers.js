import * as d3 from 'd3'

export function drawGrid(g, x, y, w, h, gridColor) {
  g.append('g').attr('class', 'grid-y')
    .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''))
    .call((sel) => sel.selectAll('line').attr('stroke', gridColor))
  g.append('g').attr('class', 'grid-x')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(x).tickSize(-h).tickFormat(''))
    .call((sel) => sel.selectAll('line').attr('stroke', gridColor))
}

export function drawAxes(g, x, y, w, h, tickColor, yFormat, rotateX, xTickValues) {
  const yAxis = g.append('g').attr('class', 'axis-y')
    .call(d3.axisLeft(y).ticks(5).tickFormat(yFormat).tickSize(0))
  yAxis.selectAll('text').attr('fill', tickColor).attr('font-size', '10px')

  const xAxisGen = d3.axisBottom(x).tickSize(0)
  if (xTickValues) xAxisGen.tickValues(xTickValues)
  const xAxis = g.append('g').attr('class', 'axis-x')
    .attr('transform', `translate(0,${h})`)
    .call(xAxisGen)
  const xText = xAxis.selectAll('text').attr('fill', tickColor).attr('font-size', '10px')
  if (rotateX) xText.attr('transform', 'rotate(-45)').style('text-anchor', 'end').attr('dx', '-4px').attr('dy', '2px')
}

export const fmtHM = (v) => {
  const h = Math.floor(v / 60)
  const m = Math.round(v % 60)
  return `${h}h${m ? m : ''}`
}

export const fmtMin = (v) => `${v} min`
