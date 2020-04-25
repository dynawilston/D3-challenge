function  makeResponsive(){
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

// clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }
  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
    top: 60,
    right: 60,
    bottom: 90,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("data.csv").then(function(response){
        console.log(response); 

        response.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
        });

        //X and Y scales
        var xLinearScale = d3.scaleLinear()
            .domain([10, d3.max(response, d => d.poverty)])
            .range([-40, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([5, d3.max(response, d => d.healthcare)])
            .range([height, -40]);


    //Create axis
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

    //Append axis to the chartGroup
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g").call(yAxis);
        
        //Make Circles
        chartGroup.selectAll("circle")
            .data(response)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 15)
            .attr("fill", "gold")
            .attr("opacity", ".3")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

        chartGroup.select("g")
            .selectAll("circle")
            .data(response)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",-535)
            .attr("text-anchor", "middle")
            .attr("fill", "black");

        //Make labels for the healthrisk graph
        
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 -250)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    }).catch(function(error){
        console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
