// Set svgStat container and chartStat dimensions
let svgStatHeight = 700;
let svgStatWidth = 1000;
let chartStatMargins = {
    top: 60,
    bottom: 100,
    left: 100,
    right: 60
};
let chartStatHeight = svgStatHeight - chartStatMargins.top - chartStatMargins.bottom
let chartStatWidth = svgStatWidth - chartStatMargins.left - chartStatMargins.right

// Initalize x and y variables
let pointGroup = [];
let xScale = [];
let yScale = [];
let xAxis = [];
let yAxis = [];
let xAxisTag = [];
let yAxisTag = [];
let povLabel;
let ageLabel;
let incomeLabel;
let healthLabel;
let smokeLabel;
let obeseLabel;
let data;

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
    // Set initial axis variables
    let yVar = 'healthcare';
    let xVar = 'poverty';

    // Plot data on first scatter
    scatterStat(data, xVar, yVar);
});

function scatterStat(data, xVar, yVar) {
    // Set circle and text size
    var radius = 15;
    var bubbleTextSize = radius * 0.85;
    console.log('pointGroup', pointGroup);
    console.log('data', data);

    // Initial plot
    if (pointGroup.length == 0){
        console.log('new');
        // Make scales (add/subtract 1 to keep circles off axes)
        xScale = d3.scaleLinear()
            .domain([d3.min(data.map(row => row[xVar]))-1, d3.max(data.map(row => row[xVar]))+1])
            .range([0, chartStatWidth]).nice();
        yScale = d3.scaleLinear()
            .domain([d3.min(data.map(row => row[yVar]))-1, d3.max(data.map(row => row[yVar]))+1])
            .range([chartStatHeight, 0]).nice();
        // Make axes
        xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);

        // Append axes
        xAxisTag = chartStat.append('g').attr('transform', `translate(0, ${chartStatHeight})`).call(xAxis);
        yAxisTag = chartStat.append('g').call(yAxis);
    
        // Make and place pointGroups
        pointGroup = chartStat.selectAll('g.pointGroup')
            .data(data).enter()
            .append('g')
            .attr('class', 'pointGroup')
            .attr('transform', d => `translate(${xScale(d[xVar])}, ${yScale(d[yVar])})`);
        
        // Append circles to point groups
        pointGroup.append('circle')
            .attr('class', 'pointCircle')
            .attr('r', radius)
            .style('fill', 'black')
            .attr('opacity', 0.3);

        // Append text to point groups
        pointGroup.append('text')
            .text(d => d.abbr)
            .style("font-size", `${bubbleTextSize}px`)
            .style('fill', 'white')
            .attr('transform', `translate(${-bubbleTextSize / 1.6}, ${bubbleTextSize / 2.5})`);

        // Append x-axis labels
        povLabel = chartStat.append("text")            
            .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 40})`)
            .text('In Poverty (%)');
        ageLabel = chartStat.append("text")             
            .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 60})`)
            .text('Age (median years)')
            .style('fill','grey');;
        incomeLabel = chartStat.append("text")             
            .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 80})`)
            .text('Household Income (median $)')
            .style('fill','grey');;

        // Append y-axis labels
        healthLabel = chartStat.append("text")            
            .attr("transform", `translate(${-40}, ${chartStatHeight / 2}) rotate(-90)`)
            .text('Lacks Healthcare (%)');
        smokeLabel = chartStat.append("text")            
            .attr("transform", `translate(${-60}, ${chartStatHeight / 2}) rotate(-90)`)
            .text('Smokes (%)')
            .style('fill','grey');;
        obeseLabel = chartStat.append("text")            
            .attr("transform", `translate(${-80}, ${chartStatHeight / 2}) rotate(-90)`)
            .text('Obese (%)')
            .style('fill','grey');

        // Make axis labels clickable
        povLabel.on('click', () => {
            povLabel.style('fill','black');
            ageLabel.style('fill','grey');
            incomeLabel.style('fill','grey');
            scatterStat(data, 'poverty', yVar)});
        ageLabel.on('click', () => {
            ageLabel.style('fill','black');
            povLabel.style('fill','grey');
            incomeLabel.style('fill','grey');
            scatterStat(data, 'age', yVar)});
        incomeLabel.on('click', () => {
            incomeLabel.style('fill','black');
            povLabel.style('fill','grey');
            ageLabel.style('fill','grey');
            scatterStat(data, 'income', yVar)});
        healthLabel.on('click', () => {
            healthLabel.style('fill','black');
            smokeLabel.style('fill','grey');
            obeseLabel.style('fill','grey');
            scatterStat(data, xVar, 'healthcare')});
        smokeLabel.on('click', () => {
            smokeLabel.style('fill','black');
            healthLabel.style('fill','grey');
            obeseLabel.style('fill','grey');
            scatterStat(data, xVar, 'smokes')});
        obeseLabel.on('click', () => {
            obeseLabel.style('fill','black');
            healthLabel.style('fill','grey');
            smokeLabel.style('fill','grey');
            scatterStat(data, xVar, 'obesity')});
    }else{
        console.log('exists')
        // Make axis labels clickable
        povLabel.on('click', () => {
            povLabel.style('fill','black');
            ageLabel.style('fill','grey');
            incomeLabel.style('fill','grey');
            scatterStat(data, 'poverty', yVar)});
        ageLabel.on('click', () => {
            ageLabel.style('fill','black');
            povLabel.style('fill','grey');
            incomeLabel.style('fill','grey');
            scatterStat(data, 'age', yVar)});
        incomeLabel.on('click', () => {
            incomeLabel.style('fill','black');
            povLabel.style('fill','grey');
            ageLabel.style('fill','grey');
            scatterStat(data, 'income', yVar)});
        healthLabel.on('click', () => {
            healthLabel.style('fill','black');
            smokeLabel.style('fill','grey');
            obeseLabel.style('fill','grey');
            scatterStat(data, xVar, 'healthcare')});
        smokeLabel.on('click', () => {
            smokeLabel.style('fill','black');
            healthLabel.style('fill','grey');
            obeseLabel.style('fill','grey');
            scatterStat(data, xVar, 'smokes')});
        obeseLabel.on('click', () => {
            obeseLabel.style('fill','black');
            healthLabel.style('fill','grey');
            smokeLabel.style('fill','grey');
            scatterStat(data, xVar, 'obesity')});
        
        // Update scales
        xScale.domain([d3.min(data.map(row => row[xVar]))-1, d3.max(data.map(row => row[xVar]))+1]).nice();
        yScale.domain([d3.min(data.map(row => row[yVar]))-1, d3.max(data.map(row => row[yVar]))+1]).nice();

        // Move points
        pointGroup.transition().attr('transform', d => `translate(${xScale(d[xVar])}, ${yScale(d[yVar])})`);
        // Reset scales
        xAxis = d3.axisBottom(xScale);
        yAxis = d3.axisLeft(yScale);

        // Update Axes
        xAxisTag.transition(400).call(xAxis);
        yAxisTag.transition(400).call(yAxis);
    };
};

