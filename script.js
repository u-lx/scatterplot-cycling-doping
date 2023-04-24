let w = 800;
let h = 500;
let padding = 50;

const svg = d3.select('svg')
  .attr('width', w)
  .attr('height', h)

const tooltip = d3.select('.container')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(resp => resp.json())
  .then(data => {

// Scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d=>d.Year)-1, d3.max(data, d=>d.Year)+1])
      .range([padding, w-padding])

    const yMap = d3.scaleLinear()
      .domain(d3.extent(data, d=>d.Seconds))
      .range([padding, h-padding])


    const parsedMin = data.map(d => d3.timeParse("%M:%S")(d.Time))

    const yScale = d3.scaleTime()
      .domain(d3.extent(parsedMin))
      .range([padding, h-padding])


// Draw
    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d=>xScale(d.Year))
    .attr('cy', d=>yMap(d.Seconds))
    .attr('r', 8)
    .style('fill', d => {
      return d.Doping ? 'rgb(180, 0, 0)' : 'blue';
    })
    .style('stroke', 'black')

    .attr('data-xvalue', d=>d.Year)
    .attr('data-yvalue', d=>d3.timeParse("%M:%S")(d.Time))
    .on('mouseover', (e,d) => {
      tooltip.style("visibility", "visible")
      .attr('data-year', d.Year)
      .html(`${d.Name}<br/>${d.Time}<br/>${d.Year}`)
      .style('left', xScale(d.Year)-330+'px')
      .style('bottom', h-yMap(d.Seconds)+30 +'px')
    })
    .on('mouseout', (e,d) => {
      tooltip.style("visibility", "hidden")
    })

// Axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => String(d))

  svg.append('g')
  .attr('transform', 'translate(0,'+(h-padding)+')')
  .attr('id', 'x-axis')
  .call(xAxis)

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => d3.timeFormat("%M:%S")(d))

  svg.append('g')
    .attr('transform', 'translate('+(padding)+',0)')
    .attr('id', 'y-axis')
    .call(yAxis)


})
