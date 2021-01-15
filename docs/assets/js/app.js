// Set svgStat container and chartStat dimensions
let svgStatHeight = 700;
let svgStatWidth = 1000;
let chartStatMargins = {
    top: 60,
    bottom: 60,
    left: 60,
    right: 60
};
let chartStatHeight = svgStatHeight - chartStatMargins.top - chartStatMargins.bottom
let chartStatWidth = svgStatWidth - chartStatMargins.left - chartStatMargins.right

// Append svg and inner chart to #scatter div
let svgStat = d3.select('#scatter').append('svg')
    .attr('width', svgStatWidth)
    .attr('height', svgStatHeight);
let chartStat = svgStat.append('g')
    .attr('id', 'chartStat')
    .attr('width', chartStatWidth)
    .attr('height', chartStatHeight)
    .attr('transform', `translate(${chartStatMargins.left}, ${chartStatMargins.top})`)

// Import data and parse
d3.csv('./assets/data/data.csv').then(data => {
    // Parse data
    data.forEach(row => {
        row.age = parseFloat(row.age);
        row.ageMoe = parseFloat(row.ageMoe);
        row.healthcare = parseFloat(row.healthcare);
        row.healthcareHigh = parseFloat(row.healthcareHigh);
        row.healthcareLow = parseFloat(row.healthcareLow);
        row.id = +row.id;
        row.income = +row.income;
        row.incomeMoe = +row.incomeMoe;
        row.obesity = parseFloat(row.obesity);
        row.obesityHigh = parseFloat(row.obesityHigh);
        row.obesityLow = parseFloat(row.obesityLow);
        row.poverty = parseFloat(row.poverty);
        row.povertyMoe = parseFloat(row.povertyMoe);
        row.smokes = parseFloat(row.smokes);
        row.smokesHigh = parseFloat(row.smokesHigh);
        row.smokesLow = parseFloat(row.smokesLow);
    });
    // TEMP
    data1 = data;
    data1.sort(function(a,b){
        return a.poverty - b.poverty;
    });
    data1.forEach(row => {
        console.log(row.abbr, row.poverty, row.healthcare)
    });
    //
    // Plot data on first scatter
    scatterStat(data);

});



function scatterStat(data) {
    // Set circle and text size
    var radius = 15;
    var textSize = radius * 0.85;

    // Make scales (add/subtract 1 to keep circles off axes)
    let xScale = d3.scaleLinear()
        .domain([d3.min(data.map(row => row.poverty))-1, d3.max(data.map(row => row.poverty))+1])
        .range([0, chartStatWidth]).nice();
    let yScale = d3.scaleLinear()
        .domain([d3.min(data.map(row => row.healthcare))-1, d3.max(data.map(row => row.healthcare))+1])
        .range([chartStatHeight, 0]).nice();

    // Make axes
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Append axes
    chartStat.append('g').attr('transform', `translate(0, ${chartStatHeight})`).call(xAxis);
    chartStat.append('g').call(yAxis);

    // Append point groups
    var radius = 15;
    var textSize = radius * 0.85;
    console.log(data);
    var pointGroup = chartStat.selectAll('g.pointGroup')
        .data(data).enter()
        .append('g')
        .attr('class', 'pointGroup')
        .attr('transform', d => `translate(${xScale(d.poverty)}, ${yScale(d.healthcare)})`);
    
    // Append circles to point groups
    pointGroup.append('circle')
        .attr('class', 'pointCircle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius)
        .style('fill', 'black')
        .attr('opacity', 0.3);

    // Append text to point groups
    pointGroup.append('text')
        .text(d => d.abbr)
        .style("font-size", `${textSize}px`)
        .style('fill', 'white')
        .attr('transform', `translate(${-textSize / 1.6}, ${textSize / 2.5})`);

    // Append axes labels
    chartStat.append("text")             
        .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 40})`)
        .text('In Poverty (%)');
    chartStat.append("text")            
        .attr("transform",
            `translate(${-40}, ${chartStatHeight / 2}) rotate(-90)`
        )
        .text('Lacks Healthcare (%)');

    // Append title
    chartStat.append("text")             
        .attr("transform",`translate(${chartStatWidth/2}, ${-40})`)
        .text('Healthcare vs. Poverty by State');
    

};