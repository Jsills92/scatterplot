import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ScatterplotGraph = () => {
    const svgRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const url = 
            "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
            const response = await fetch(url);
            const data = await response.json();
            
            drawChart(data);
        };

        fetchData();
    }, []);

    const drawChart = (data) => {
        const width = 800;
        const height = 500;
        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
      
        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height);
      
        // Clear previous content before re-rendering
        svg.selectAll("*").remove();
      
        // Define the x and y scales
        const xScale = d3.scaleTime()
          .domain([d3.min(data, d => new Date(d["Year"], 0, 1)), d3.max(data, d => new Date(d["Year"], 0, 1))])
          .range([margin.left, width - margin.right]);
      
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d["Time"])]) // You may need to convert Time to minutes/seconds 
          .range([height - margin.bottom, margin.top]);
      
        // Define the x and y axes using the scales
        const xAxis = d3.axisBottom(xScale)
          .ticks(5) // Adjust the number of ticks based on needs
          .tickFormat(d3.timeFormat("%Y")); // Format the tick labels as years
      
        const yAxis = d3.axisLeft(yScale)
          .ticks(5) // Adjust the number of ticks based on your needs
          .tickFormat(d3.timeFormat("%M:%S")); // Format the y-axis tick labels as time (minutes:seconds)
      
        // Append the x and y axes to the SVG container
        svg.append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${height - margin.bottom})`)
          .call(xAxis);
      
        svg.append("g")
          .attr("id", "y-axis")
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(yAxis);
      };
      
};

export default ScatterplotGraph;