// Set svgStat container and chartStat dimensions
let svgStatHeight1 = 700;
let svgStatWidth1 = 1000;
let chartStatMargins1 = {
    top: 60,
    bottom: 60,
    left: 60,
    right: 60
};
let chartStatHeight1 = svgStatHeight1 - chartStatMargins1.top - chartStatMargins1.bottom
let chartStatWidth1 = svgStatWidth1 - chartStatMargins1.left - chartStatMargins1.right

// Append svg and inner chart to #scatter div
let svgStat1 = d3.select('#scatter1').append('svg')
    .attr('width', svgStatWidth1)
    .attr('height', svgStatHeight1);
let chartStat1 = svgStat1.append('g')
    .attr('id', 'chartStat')
    .attr('width', chartStatWidth1)
    .attr('height', chartStatHeight1)
    .attr('transform', `translate(${chartStatMargins1.left}, ${chartStatMargins1.top})`)

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
    // Plot data
    scatterStat1(data);

});



function scatterStat1(data) {
    // Set circle and text size
    var radius = 15;
    var textSize = radius * 0.85;

    // Make scales (add/subtract 1 to keep circles off axes)
    let xScale = d3.scaleLinear()
        .domain([d3.min(data.map(row => row.poverty))-1, d3.max(data.map(row => row.poverty))+1])
        .range([0, chartStatWidth1]).nice();
    let yScale = d3.scaleLinear()
        .domain([d3.min(data.map(row => row.healthcare))-1, d3.max(data.map(row => row.healthcare))+1])
        .range([chartStatHeight1, 0]).nice();

    // Make axes
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Append axes
    chartStat1.append('g').attr('transform', `translate(0, ${chartStatHeight1})`).call(xAxis);
    chartStat1.append('g').call(yAxis);

    // Append point groups
    var radius = 15;
    var textSize = radius * 0.85;
    console.log(data);
    var pointGroup = chartStat1.selectAll('g.pointGroup')
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
    chartStat1.append("text")             
        .attr("transform",`translate(${chartStatWidth1/2}, ${chartStatHeight1 + 40})`)
        .text('In Poverty (%)');
    chartStat1.append("text")            
        .attr("transform",
            `translate(${-40}, ${chartStatHeight1 / 2}) rotate(-90)`
        )
        .text('Lacks Healthcare (%)');

    // Append title
    chartStat1.append("text")             
        .attr("transform",`translate(${chartStatWidth1/2}, ${-40})`)
        .text('Healthcare vs. Poverty by State');
    

};