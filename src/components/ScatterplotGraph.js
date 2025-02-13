import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ScatterplotGraph = () => {
    const svgRef = useRef();

    useEffect(() => {

        const tooltip = d3.select("#tooltip")
            .append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "lightgray")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("font-size", "12px");

        const fetchData = async () => {
            const url = 
            "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
            const response = await fetch(url);
            const data = await response.json();
            
            console.log(data);
            drawChart(data, tooltip);
        };

        fetchData();
    }, []);

    const drawChart = (data, tooltip) => {
        const width = 800;
        const height = 500;
        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
      
        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#f4f4f4");
      
        // Clear previous content before re-rendering
        svg.selectAll("*").remove();
      
        // Define the x and y scales
        const xScale = d3.scaleTime()
          .domain([d3.min(data, d => new Date(1994, 0, 1)), d3.max(data, d => new Date(2016, 0, 1))])
          .range([margin.left, width - margin.right]);
      
          const yScale = d3.scaleTime()
    .domain([
        d3.min(data, d => new Date(0, 0, 0, 0, 0, d.Seconds)), // Convert min seconds into a Date object
        d3.max(data, d => new Date(0, 0, 0, 0, 0, d.Seconds))  // Convert max seconds into a Date object
    ])
    .range([height - margin.bottom, margin.top]); // Ensure proper vertical scaling

        
      
        // Define the x and y axes using the scales
        const xAxis = d3.axisBottom(xScale)
          .ticks(12) // Adjust the number of ticks based on needs
          .tickFormat(d3.timeFormat("%Y")); // Format the tick labels as years
      
          const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))
          .ticks(12); // Adjust the number of ticks based on your needs
     

      
        // Append the x and y axes to the SVG container
        svg.append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${height - margin.bottom})`)
          .call(xAxis);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Year");

      
        svg.append("g")
          .attr("id", "y-axis")
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(yAxis);

          svg.append("text")
          .attr("x", -height / 2) // Centers the label along the y-axis
          .attr("y", margin.left / 3) // Moves it slightly away from the axis
          .attr("transform", "rotate(-90)") 
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Time in Minutes");

          // Remove old circles before appending new ones
svg.selectAll(".dot").remove(); 


// Append new circles
svg.selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("data-xvalue", d => new Date(d.Year, 0, 1))
  .attr("data-yvalue", d => new Date(0, 0, 0, 0, 0, d.Seconds)) // `data-yvalue` must match the scale
  .attr("cx", d => xScale(new Date(d["Year"], 0, 1)))
  .attr("cy", d => yScale(new Date(0, 0, 0, 0, 0, d.Seconds))) // Convert each data point into a Date object
  .attr("r", 5)
  .style("fill", "steelblue")
  .style("opacity", 0.7)
  .on("mouseover", function(event, d) {
    tooltip.attr("id", "tooltip") // Ensure ID exists
      .attr("data-year", d.Year) // Critical for passing test
      .style("visibility", "visible") // Show tooltip
      .html(`
        <strong>Name:</strong> ${d.Name}<br>
        <strong>Year:</strong> ${d.Year}<br>
        <strong>Time:</strong> ${d.Time}
      `);

    // Position tooltip near cursor
    tooltip.style("top", (event.pageY + 10) + "px")
      .style("left", (event.pageX + 10) + "px");
})
.on("mouseout", function() {
    tooltip.style("visibility", "hidden");
});




      };
     return <svg ref={svgRef}></svg>; 
};

export default ScatterplotGraph;