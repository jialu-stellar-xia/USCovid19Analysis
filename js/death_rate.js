// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 660 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("div#death_rate_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// List of groups (here I have one group per column)
var allStates = d3.map(data, function(d){return(d.state)}).keys()

// Transform the date
var parseDate = d3.timeParse("%Y-%m-%d");
data.forEach(function(d,i) {
  d.date = parseDate(d.date);
});

// // Get the national data
// nation_data = d3.rollup(data, v1 => d3.sum(v1, d => d.tot_death), v2 => d3.sum(v2, d => d.tot_cases), d => d.date)
// console.log(nation_data)

// add the options to the button
var options1 = d3.select("#selectButton1")
  .selectAll("option")
  .data(allStates)
  .enter()
  .append('option')
  .property("selected", function(d){ return d === allStates[0]; })

options1.text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

var options2 = d3.select("#selectButton2")
  .selectAll("option")
  .data(allStates)
  .enter()
  .append('option')
  .property("selected", function(d){ return d === allStates[1]; })

options2.text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(allStates)
  .range(["#1b70fc", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#faff16"]);

//Add X axis --> it is a date format
var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.date; }))
  .range([ 0, width ]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b')));


// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.death_rate; })])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// text label for the x axis
svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Date");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Death rate");

// Initialize line with first group of the list
var line1 = svg
  .append('g')
  .append("path")
    .datum(data.filter(function(d){return d.state==allStates[0]}))
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(+d.death_rate) })
    )
    .attr("stroke", function(d){ return myColor(allStates[0]) })
    .style("stroke-width", 1)
    .style("fill", "none")

var line2 = svg
  .append('g')
  .append("path")
    .datum(data.filter(function(d){return d.state==allStates[1]}))
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(+d.death_rate) })
    )
    .attr("stroke", function(d){ return myColor(allStates[1]) })
    .style("stroke-width", 1)
    .style("fill", "none")

// Handmade legend
svg.append("circle").attr("id","circle1").attr("cx",320).attr("cy",50).attr("r", 6).style("fill", myColor(allStates[0]))
svg.append("text").attr("id","legend1").attr("x", 340).attr("y", 50).text(allStates[0]).style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("circle").attr("id","circle2").attr("cx",320).attr("cy",70).attr("r", 6).style("fill", myColor(allStates[1]))
svg.append("text").attr("id","legend2").attr("x", 340).attr("y", 70).text(allStates[1]).style("font-size", "15px").attr("alignment-baseline","middle")

// A function that update the chart
function update1(selectedState) {

  // Create new data with the selection?
  var dataFilter = data.filter(function(d){return d.state==selectedState})

  // Give these new data to update line
  line1
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(+d.death_rate) })
      )
      .attr("stroke", function(d){ return myColor(selectedState) })

  svg.select("#circle1").attr("cx",320).attr("cy",50).attr("r", 6).style("fill", myColor(selectedState))
  svg.select("#legend1").attr("x", 340).attr("y", 50).text(selectedState).style("font-size", "15px").attr("alignment-baseline","middle")
}

// When the button is changed, run the updateChart function
d3.select("#selectButton1").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update1(selectedOption)
})

// A function that update the chart
function update2(selectedState) {

  // Create new data with the selection?
  var dataFilter = data.filter(function(d){return d.state==selectedState})

  // Give these new data to update line
  line2
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(+d.death_rate) })
      )
      .attr("stroke", function(d){ return myColor(selectedState) })

  svg.select("#circle2").attr("cx",320).attr("cy",70).attr("r", 6).style("fill", myColor(selectedState))
  svg.select("#legend2").attr("x", 340).attr("y", 70).text(selectedState).style("font-size", "15px").attr("alignment-baseline","middle")
}

// When the button is changed, run the updateChart function
d3.select("#selectButton2").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update2(selectedOption)
})
