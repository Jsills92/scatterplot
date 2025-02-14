import { useEffect, useRef } from "react";
import * as d3 from "d3";

const ScatterplotGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Remove any existing tooltip (if any) before creating a new one
    d3.select("#tooltip").remove();

    // Append tooltip outside the SVG, directly to the body
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "lightgray")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "12px")
      .style("z-index", "10"); // Make sure it's on top of other elements

    const fetchData = async () => {
      const url =
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
      const response = await fetch(url);
      const data = await response.json();
      console.log(data); // Add this to inspect the data structure

      drawChart(data, tooltip);
    };

    fetchData();
  }, []);

  const drawChart = (data, tooltip) => {
    const margin = { top: 100, right: 20, bottom: 60, left: 110 };
    const width = 800 - margin.left - margin.right;
    const height = 500;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + 30)
      .attr("height", height + 30)
      .attr("transform", "translate(" + 500 + ")")
      .style("background-color", "#222831");

    // Clear previous content before re-rendering
    svg.selectAll("*").remove();

    // Define the x and y scales
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => new Date(1993, 0, 1)),
        d3.max(data, (d) => new Date(2016, 0, 1)),
      ])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleTime()
      .domain([
        d3.max(data, (d) => new Date(0, 0, 0, 0, 0, d.Seconds)),
        d3.min(data, (d) => new Date(0, 0, 0, 0, 0, d.Seconds)),
      ])
      .range([height - margin.bottom, margin.top]);

    // Define the x and y axes using the scales
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(12)
      .tickFormat(d3.timeFormat("%Y"));

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"))
      .ticks(12);

    // Append the x and y axes to the SVG container
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text") // Selects all tick labels
      .style("fill", "#EEEEEE") // Change text color
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif");

    svg
      .select("#x-axis")
      .selectAll("path, line") // Axis line & ticks
      .style("stroke", "#EEEEEE"); // Change color to white

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#EEEEEE")
      .text("Year");

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .selectAll("text") // Selects all tick labels
      .style("fill", "#EEEEEE") // Change text color
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif");

    svg
      .select("#y-axis")
      .selectAll("path, line") // Axis line & ticks
      .style("stroke", "#EEEEEE"); // Change color to white

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#EEEEEE")
      .text("Time in Minutes");
    // title
    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 1.75)
      .attr("y", height - 450)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("fill", "#EEEEEE")
      .text("Doping in Professional Bicycle Racing");

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 1.75)
      .attr("y", height - 425)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "#EEEEEE")
      .text("35 Fastest times up Alpe d'Huez");

      svg.append("rect")
    .attr("x", 660)  // X position of the rectangle
    .attr("y", 110)  // Y position of the rectangle
    .attr("width", 20)  // Width of the rectangle
    .attr("height", 20)  // Height of the rectangle
    .style("fill", "red");

svg.append("text")
    .attr("x", 540)  // Position text near the rectangle
    .attr("y", 125)
    .style("font-size", "14px")
    .text("Doping allegations")
    .style("fill", "white");  // Text color for visibility

svg.append("rect")
    .attr("x", 660)  // X position of the second rectangle
    .attr("y", 150)  // Y position of the second rectangle (below the first)
    .attr("width", 20)  // Width of the rectangle
    .attr("height", 20)  // Height of the rectangle
    .style("fill", "#76ABAE");

svg.append("text")
    .attr("x", 575)  // Position text near the second rectangle
    .attr("y", 166)
    .style("font-size", "14px")
    .text("Clean Riders")
    .style("fill", "white");  // Text color for visibility


    // Append new circles
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => new Date(0, 0, 0, 0, 0, d.Seconds))
      .attr("cx", (d) => xScale(new Date(d["Year"], 0, 1)))
      .attr("cy", (d) => yScale(new Date(0, 0, 0, 0, 0, d.Seconds)))
      .attr("r", 5)
      .style("fill", d => d.Doping !== "" ? "red" : "#76ABAE")
      .style("opacity", 0.7)
      .on("mouseover", function (event, d) {
        //const year = d.Year;  // Use the `Year` property from your data

        // Set the tooltip properties correctly
        tooltip
          .attr("data-year", d.Year) // Set `data-year` as just the year
          .style("visibility", "visible").html(`
                        <strong>Name:</strong> ${d.Name}<br>
                        <strong>Year:</strong> ${d.Year}<br>
                        <strong>Time:</strong> ${d.Time}
                    `);

        // Position tooltip near cursor
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  };

  return (
    <div className="container">
      <div id="legend">
        <p></p>
      </div>
      <svg ref={svgRef}></svg>{" "}
    </div>
  );
};

export default ScatterplotGraph;
