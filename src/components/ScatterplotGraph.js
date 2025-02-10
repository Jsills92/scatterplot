import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ScatterplotGraph = () => {
    const svgRef = useRef();

    useEffect(() => {

        const tooltip = d3.select("body")
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
        const xScale = d3.scaleLinear()
          .domain([d3.min(data, d => new Date(1993, 0, 1)), d3.max(data, d => new Date(2016, 0, 1))])
          .range([margin.left, width - margin.right]);
      
          const yScale = d3.scaleLinear()
          .domain([36.50 * 60, d3.max(data, d => d.Seconds)]) // Invert range so faster times are higher
          .range([height - margin.bottom, margin.bottom]); // Use margin.top to avoid cutting off points
        
      
        // Define the x and y axes using the scales
        const xAxis = d3.axisBottom(xScale)
          .ticks(5) // Adjust the number of ticks based on needs
          .tickFormat(d3.timeFormat("%Y")); // Format the tick labels as years
      
        const yAxis = d3.axisLeft(yScale)
          .ticks(5) // Adjust the number of ticks based on your needs
          .tickFormat(d => {
            const minutes = Math.floor(d / 60);
            const seconds = d % 60;
            return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  });
 // Format the y-axis tick labels as time (minutes:seconds)
      
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
  .attr("data-yvalue", d => d.Seconds) // Keep it as numeric seconds
  .attr("cx", d => xScale(new Date(d.Year, 0, 1)))
  .attr("cy", d => yScale(d.Seconds)) // This should now work correctly
  .attr("r", 5)
  .style("fill", "steelblue")
  .style("opacity", 0.7)
  .on("mouseover", function(event, d) {
            // Show the tooltip
            tooltip.style("visibility", "visible")
              .attr("data-year", d["Year"]) // Set the data-year attribute
              .html(`
                <strong>Name:</strong> ${d["Name"]}<br>
                <strong>Year:</strong> ${d["Year"]}<br>
                <strong>Time:</strong> ${d["Time"]}
              `);
      
            // Position the tooltip near the cursor
            tooltip.style("top", (event.pageY + 5) + "px")
              .style("left", (event.pageX + 5) + "px");
          })
          .on("mouseout", function() {
            // Hide the tooltip when the mouse leaves
            tooltip.style("visibility", "hidden");
          });

      };
     return <svg ref={svgRef}></svg>; 
};

export default ScatterplotGraph;