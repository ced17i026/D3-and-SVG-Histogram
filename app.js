var width = 1300;
var height = 700;
var barpadding = 1;
var minYear = d3.min(birthData,d => d.year);
var yearData = birthData.filter( d => d.year === minYear);
var svgComponent = d3.select("svg")
    .attr("height",height)
    .attr("width",width);
//defining the x-scale
var xScale = d3.scaleLinear()
                .domain([0,d3.max(yearData,d=> d.births)])
                .rangeRound([0,width]);
//making the histogram component
var histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks())
                    .value(d => d.births);
//created bins of histogram
var bins = histogram(yearData);
var barWidth = width/bins.length - barpadding;
//defining y-scale i.e scaling bins data to fit in height
var yScale = d3.scaleLinear()
                .domain([0,d3.max(bins,d => d.length)])
                .range([height,0]);
//creating bars of the histogram
var bars = svgComponent.selectAll(".bar")
            .data(bins)
            .enter()
            .append("g")
                .classed("bar",true);
//now appending rect as bars
bars.append("rect")
    .attr("x",(d,i) => {
        return xScale(d.x0);
    })
    .attr("y", d=>yScale(d.length))
    .attr("height", d => (height-yScale(d.length)))
    .attr("width", d => xScale(d.x1)-xScale(d.x0))
    .attr("fill","#9c27B0");
//inserting the text to bars
bars.append("text")
        .text(d=>d.x0+" - "+d.x1+"(bar height: "+d.length+" )")
        .attr("transform","rotate(-90)")
        .attr("x", -height+10)
        .attr("y", d => (xScale(d.x1)+xScale(d.x0))/2)
        .style("alignment-baseline","middle");