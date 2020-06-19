// API DATA
// Here are the datasets you will need to complete this project:

// US Education Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
// US County Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json
const fillColors = [
    '#e0b6b6',
    '#db9e9e',
    '#d47f7f',
    '#fa5c5c',
    '#e83535',
    '#e31414',
    '#a10303',
    '#5c0101',
    '#300000'
]

const colors = (num) => {
    if(num < 3) {
        return fillColors[0];
    } else if(num >= 3 && num < 12) {
        return fillColors[1];
    } else if(num >= 12 && num < 21) {
        return fillColors[2];
    } else if(num >= 21 && num < 30) {
        return fillColors[3];
    } else if(num >= 30 && num < 39) {
        return fillColors[4];
    } else if(num >= 39 && num < 48) {
        return fillColors[5];
    } else if(num >= 48 && num < 57) {
        return fillColors[6];
    } else if(num >= 57 && num < 66) {
        return fillColors[7];
    } else if(num >= 66) {
        return fillColors[8];
    }
}

const formChart = async () => {

    // Education data
    const responseEdu = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
    const dataEdu = await responseEdu.json();


    // County data
    const responseCounty = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
    const dataCounty = await responseCounty.json();

    // console.log(dataCounty.objects.counties)


    // SVG dimensions
    const height = 540;
    const width = 960;

    const svg = d3.select('.container')
                .append('svg')
                .attr('height', height + 50)
                .attr('width', width + 100)


    const path = d3.geoPath();

    // Tooltip
    const tooltip = d3.select(".container")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr('id', 'tooltip')
    .style('opacity', 0.9)


    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(dataCounty, dataCounty.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
            const data = dataEdu.filter(edu => {
                return d.id === edu.fips;
            })

            return data[0].bachelorsOrHigher

        })
        .attr('fill', (d) => {
            const data = dataEdu.filter(edu => {
                return d.id === edu.fips;
            })

            return colors(data[0].bachelorsOrHigher)
        })
        .attr('stroke', 'black')
        .attr('stroke-width', '0.5')
        .attr('d', path)
        .on("mouseover", function(d){return tooltip.style("visibility", "visible").attr('data-date', d[0])})
        .on("mousemove", function(d){return tooltip.style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px").html(() => {
            const data = dataEdu.filter(edu => {
                return d.id === edu.fips;
            })
            return `<center><strong>${data[0].area_name}</strong>,<strong>${data[0].state} : </strong><strong> ${data[0].bachelorsOrHigher} %</strong></center>`
        }).attr('data-education', () => {
            const data = dataEdu.filter(edu => {
                return d.id === edu.fips;
            })

            return data[0].bachelorsOrHigher;
        })})
        .on("mouseout", function(d){return tooltip.style("visibility", "hidden")})

    const legend = d3.select('#legend')
                .append('svg')
                .attr('height', 100)
                .attr('width',900)
                


    
    
    var formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

    var threshold = d3.scaleThreshold()
    .domain([0.03, 0.12, 0.21, 0.30, 0.39, 0.48, 0.57, 0.66])
    .range(fillColors);

    var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 500]);

    var xAxis = d3.axisBottom(x)
    .tickSize(13)
    .tickValues(threshold.domain())
    .tickFormat(function(d) { return formatPercent(d) })

    const g = legend.append("g").call(xAxis).style('font-size', '15px');

    g.select(".domain")
    .remove();

    g.selectAll("rect")
    .data(threshold.range().map(function(color) {
    var d = threshold.invertExtent(color);
    if (d[0] == null) d[0] = x.domain()[0];
    if (d[1] == null) d[1] = x.domain()[1];
    return d;
    }))
    .enter().insert("rect", ".tick")
    .attr("height", 10)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return width/11 })
    .attr("fill", function(d) { return threshold(d[0]); })
}

formChart();