import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ScatterplotGraph = () => {
    const svgRef = useRef();

    useEffect(() => { 
        
        
        // Remove any existing tooltip (if any) before creating a new one
        d3.select("#tooltip").remove();

        // Append tooltip outside the SVG, directly to the body
        const tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "lightgray")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("font-size", "12px")
            .style("z-index", "10"); // Make sure it's on top of other elements

        const fetchData = async () => {
            const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
            const response = await fetch(url);
            const data = await response.json();
            
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
            .domain([d3.min(data, d => new Date(1993, 0, 1)), d3.max(data, d => new Date(2016, 0, 1))])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleTime()
            .domain([
                d3.max(data, d => new Date(0, 0, 0, 0, 0, d.Seconds)),
                d3.min(data, d => new Date(0, 0, 0, 0, 0, d.Seconds)) 
                
            ])
            .range([height - margin.bottom, margin.top]);

        // Define the x and y axes using the scales
        const xAxis = d3.axisBottom(xScale)
            .ticks(12) 
            .tickFormat(d3.timeFormat("%Y"));

        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"))
            .ticks(12);

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
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .attr("transform", "rotate(-90)") 
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time in Minutes");

        // Append new circles
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => new Date(0, 0, 0, 0, 0, d.Seconds))
            .attr("cx", d => xScale(new Date(d["Year"], 0, 1)))
            .attr("cy", d => yScale(new Date(0, 0, 0, 0, 0, d.Seconds)))
            .attr("r", 5)
            .style("fill", "steelblue")
            .style("opacity", 0.7)
            .on("mouseover", function(event, d) {
                //const year = d.Year;  // Use the `Year` property from your data
            
                // Set the tooltip properties correctly
                tooltip.attr("data-year", d.Year)  // Set `data-year` as just the year
                    .style("visibility", "visible")    
                    .html(`
                        <strong>Name:</strong> ${d.Name}<br>
                        <strong>Year:</strong> ${d.year}<br>
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

    return (
        <div className="container">
            <h1 id="title">Doping in Professional Bicycle Racing</h1>
            <h2 id="title">35 Fastest times up Alpe d'Huez</h2>
            <div id="legend"><p>Legend content goes here</p></div>
            <svg ref={svgRef}></svg> {/* D3 will append the SVG directly to this element */}
        </div>
    );
    
};

export default ScatterplotGraph;
