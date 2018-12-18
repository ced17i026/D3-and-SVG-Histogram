var width = 1300;
var height = 700;
var barpadding = 1;
var minYear = d3.min(birthData,d => d.year);
var maxYear = d3.max(birthData,d => d.year);
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
d3.select("input")
    .property("min",minYear)
    .property("max", maxYear)
    .property('value',minYear)
    .on("input",function(){
        var year = +d3.event.target.value;
        yearData = birthData.filter(d=>{
            return d.year === year});
        xScale.domain([0,d3.max(yearData,d=>d.births)]);
        histogram.domain(xScale.domain())
                    .thresholds(xScale.ticks());
        bins = histogram(yearData);
        yScale.domain([0,d3.max(bins,d=>d.length)]);
        bars = d3.select("svg")
                    .selectAll(".bars")
                    .data(bins)
        //general update pattern starts here
        
        //removing any exit data here
        bars.exit().remove();
        //inserting new bars
        var g = bars.enter()
            .append("g")
                .classed("bars",true);
        //giving rectangle to all bars
        g.append("rect");
        g.append("text");
        //merging to apply style to all newly added rectangle
        g.merge(bars)
            .select("rect")
                .attr("x",(d,i) => {
                    return xScale(d.x0);
                })
                .attr("y", d=>yScale(d.length))
                .attr("height", d => (height-yScale(d.length)))
                .attr("width",d=> {
                    var width = xScale(d.x1) - xScale(d.x0);
                    return width > 0 ? width:0;
                })
                .attr("fill","#9c27B0");
        //merging to apply the text style to all newly created text
        g.merge(bars)
            .select("text")
                .text(d=>d.x0+" - "+d.x1+"(bar height: "+d.length+" )")
                .attr("transform","rotate(-90)")
                .attr("x", -height+10)
                .attr("y", d => (xScale(d.x1)+xScale(d.x0))/2)
                .style("alignment-baseline","middle");
    })