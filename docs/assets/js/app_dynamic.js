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

// Initalize variables
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
let yVar;
let xVar;
let titleLabel;

// Append svg and inner chart to #scatter div
let svgStat = d3.select('#scatter2').append('svg')
    .attr('width', svgStatWidth)
    .attr('height', svgStatHeight);
let chartStat = svgStat.append('g')
    .attr('id', 'chartStat')
    .attr('width', chartStatWidth)
    .attr('height', chartStatHeight)
    .attr('transform', `translate(${chartStatMargins.left}, ${chartStatMargins.top})`)

// create tooltip to append to points on plot
 let tool_tip = d3.tip().attr('class', 'd3-tip').offset([-8,0])

// Import data and parse
d3.csv('./assets/data/data.csv').then(dataIn => {
    console.log(dataIn);
    data = dataIn;
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
    xVar = 'poverty';
    yVar = 'healthcare';

    // Construct chart
    scatterStat(data, xVar, yVar);
});

// Handle click of x-axis label
function clickXLabel(){
    // Make label black. Make other labels grey.
    // Make label variable stored as the x variable to be displayed on plot
    var label = d3.select(this);
    label.attr('fill','black');
    if(label.attr('id') == 'povLabel'){
        d3.select('#ageLabel').attr('fill','grey');
        d3.select('#incomeLabel').attr('fill','grey');
        xVar = 'poverty';
    }else if (label.attr('id') == 'ageLabel'){
        label.attr('fill','black');
        d3.select('#povLabel').attr('fill','grey');
        d3.select('#incomeLabel').attr('fill','grey');
        xVar = 'age';
    }else{
        label.attr('fill','black');
        d3.select('#povLabel').attr('fill','grey');
        d3.select('#ageLabel').attr('fill','grey');
        xVar = 'income';
    };
    // Adjust scales to new x variable
    xScale.domain([d3.min(data.map(row => row[xVar]))-1, d3.max(data.map(row => row[xVar]))+1]).nice();
    xAxis = d3.axisBottom(xScale);
    xAxisTag.transition(400).call(xAxis);

    // Adjust points to new x variable
    pointGroup.transition().attr('transform', d => `translate(${xScale(d[xVar])}, ${yScale(d[yVar])})`);

    // Adjust tooltip to new x variable
    tool_tip.html(function(d) { return `<text>${d['abbr']}</text><br/><text>${xVar}: ${d[xVar]}</text><br/><text>${yVar}: ${d[yVar]}</text>`});
    chartStat.call(tool_tip);
    // Adjust title to new x variable
    titleLabel.text(`${xVar.charAt(0).toUpperCase() + xVar.slice(1)} vs. ${yVar.charAt(0).toUpperCase() + yVar.slice(1)} by State`);

};
// Handle click of y-axis label
function clickYLabel(){
    // Make label black. Make other labels grey.
    // Make label variable stored as the y variable to be displayed on plot
    var label = d3.select(this);
    label.attr('fill','black');
    if(label.attr('id') == 'healthLabel'){
        d3.select('#smokeLabel').attr('fill','grey');
        d3.select('#obeseLabel').attr('fill','grey');
        yVar = 'healthcare';
    }else if (label.attr('id') == 'smokeLabel'){
        label.attr('fill','black');
        d3.select('#healthLabel').attr('fill','grey');
        d3.select('#obeseLabel').attr('fill','grey');
        yVar = 'smokes';
    }else{
        label.attr('fill','black');
        d3.select('#smokeLabel').attr('fill','grey');
        d3.select('#ageLabel').attr('fill','grey');
        yVar = 'obesity';
    };
    // Adjust scales to new y variable
    yScale.domain([d3.min(data.map(row => row[yVar]))-1, d3.max(data.map(row => row[yVar]))+1]).nice();
    yAxis = d3.axisLeft(yScale);
    yAxisTag.transition(400).call(yAxis);

    // Adjust points to new y variable
    pointGroup.transition().attr('transform', d => `translate(${xScale(d[xVar])}, ${yScale(d[yVar])})`);

    // Adjust tooltip to new y variable
    tool_tip.html(function(d) { return `<text>${d['abbr']}</text><br/><text>${xVar}: ${d[xVar]}</text><br/><text>${yVar}: ${d[yVar]}</text>`});
    chartStat.call(tool_tip);

    // Adjust title to new y variable
    titleLabel.text(`${xVar.charAt(0).toUpperCase() + xVar.slice(1)} vs. ${yVar.charAt(0).toUpperCase() + yVar.slice(1)} by State`);
};

function scatterStat(data, xVar, yVar) {
    // Set circle and text size
    var radius = 15;
    var bubbleTextSize = radius * 0.85;

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

    // Add tooltip
    tool_tip.html(function(d) { return `<text>${d['abbr']}</text><br/><text>${xVar}: ${d[xVar]}</text><br/><text>${yVar}: ${d[yVar]}</text>`});
    chartStat.call(tool_tip);

    // Make and place pointGroups
    pointGroup = chartStat.selectAll('g.pointGroup')
        .data(data).enter()
        .append('g')
        .attr('class', 'pointGroup')
        .attr('transform', d => `translate(${xScale(d[xVar])}, ${yScale(d[yVar])})`)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);
    
    // Append circles to point groups
    pointGroup.append('circle')
        .attr('class', 'pointCircle')
        .attr('r', radius)
        .attr('fill', 'black')
        .attr('opacity', 0.3);

    // Append text to point groups
    pointGroup.append('text')
        .text(d => d.abbr)
        .style("font-size", `${bubbleTextSize}px`)
        .attr('fill', 'white')
        .attr('transform', `translate(${-bubbleTextSize / 1.6}, ${bubbleTextSize / 2.5})`);

    // Append x-axis labels
    povLabel = chartStat.append("text")
        .attr('id','povLabel')            
        .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 40})`)
        .text('In Poverty (%)');
    ageLabel = chartStat.append("text")
        .attr('id','ageLabel')            
        .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 60})`)
        .text('Age (median years)')
        .attr('fill','grey');;
    incomeLabel = chartStat.append("text")
        .attr('id','incomeLabel')            
        .attr("transform",`translate(${chartStatWidth/2}, ${chartStatHeight + 80})`) 
        .text('Household Income (median $)')
        .attr('fill','grey');;

    // Append y-axis labels
    healthLabel = chartStat.append("text") 
        .attr('id','healthLabel')             
        .attr("transform", `translate(${-40}, ${chartStatHeight / 2}) rotate(-90)`)
        .text('Lacks Healthcare (%)');
    smokeLabel = chartStat.append("text")
        .attr('id','smokeLabel')            
        .attr("transform", `translate(${-60}, ${chartStatHeight / 2}) rotate(-90)`)
        .text('Smokes (%)')
        .attr('fill','grey');;
    obeseLabel = chartStat.append("text")
        .attr('id','obeseLabel')            
        .attr("transform", `translate(${-80}, ${chartStatHeight / 2}) rotate(-90)`)
        .text('Obese (%)')
        .attr('fill','grey');
    
    // Append title
    nameCapitalized = xVar.charAt(0).toUpperCase() + xVar.slice(1)
    titleLabel = chartStat.append("text")             
    .attr("transform",`translate(${chartStatWidth1/2}, ${-40})`)
    .text(`${xVar.charAt(0).toUpperCase() + xVar.slice(1)} vs. ${yVar.charAt(0).toUpperCase() + yVar.slice(1)} by State`);
    

    // Make axis labels clickable
    povLabel.on('click', clickXLabel);
    ageLabel.on('click', clickXLabel);
    incomeLabel.on('click', clickXLabel);
    healthLabel.on('click', clickYLabel);
    smokeLabel.on('click', clickYLabel);
    obeseLabel.on('click', clickYLabel);

};