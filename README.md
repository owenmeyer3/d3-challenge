## Overview

This project uses d3.js to visualize comparisons of demographic information for each state (and Washington D.C.) in the US. The demographic information comes from th US Census Bureaus [2014 estimates](https://data.census.gov/cedsci/) (data.csv). All dependent variable are able to be visualized for any independent variable.

Independent variables include:
* Poverty (% of Population)
* Age (median years)
* Household Income (Median $)

Dependent variables include:
* Obesity (% of Population)
* Smokes (% of Population)
* Lacks Healthcare (% of Population)

# Part 1

The first visual is created by running app.js. This visual plots poverty % vs. lacking healthcare % for each state. Each state shows up as a bubble on a scatterplot, labeled by state abbreviation.

# Part 2

The next visual is created by running app_dynamic.js. This plot is similar to Part 1 with a few additional features. Independent and dependent variable labels are added to the axis. Users can select an axis label, which adjusts the axis scale, the position of the bubbles to represent the newly selected axis parameter. The currently selected parameter is black while the others are colored grey.

Tooltip popups appear when the user hovers the mouse over any bubble to reveal the exact coordinates of the bubble. The tooltip adapts to the selected axes. The tooltip comes from the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)

Transitions are included when bubbles or axes move. This provides a sleek interface for the user.