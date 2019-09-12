/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/
var margin = { left: 80, right: 20, top: 50, bottom: 100 };

var width = 800 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP per Capita ($)");

// Y Label
g.append("text")
	.attr("y", -60)
	.attr("x", -(height / 2))
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy(Years)");

// Scales
var x = d3.scaleLog()
	.base(10)
	.range([0, width])
	.domain([142, 150000]);


var y = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 100])

var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);


var continentColor = d3.scaleOrdinal(d3.schemeCategory10);



// X Axis
var xAxis = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));

g.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(" + 0 + "," + height + ")")
	.call(xAxis)


// Y Axis
var yAxis = d3.axisLeft(y)

g.append("g")
	.attr("class", "x-axis")
	.call(yAxis)

// Year
var year = g.append("text")
	.attr("x", width)
	.attr("y", height - 10)
	.attr("text-anchor", "end")
	.attr("fill", "grey")
	.style("font-size", "18px")
	.text("...")

// Transition
var transition = d3.transition()
	.duration(100);




d3.json("data/data.json").then(function (data) {
	let i = -1;
	d3.interval(function () {
		i === data.length ? i = 0 : i++

		updateGraph(data[i]);
	}, 100);

	updateGraph(data[0]);
})


const updateGraph = (data) => {
	var activeCountries = data.countries.filter((d) => {
		return d.income !== null && d.life_exp !== null && d.population !== null
	}).map(function (country) {
		country.income = +country.income;
		country.life_exp = +country.life_exp;
		return country;
	})

	var circles = g.selectAll("circle")
		.data(activeCountries, function (d) {
			return d.country
		})

	circles.exit().remove();

	year.text(data.year)

	circles.enter()
		.append("circle")
		.attr("fill", (d) => {
			return continentColor(d.continent)
		})
		.append("title")
		.text(function (d) { return d.country })
		.merge(circles)
		.transition(transition)
		.attr("cx", function (d) {
			return x(d.income)
		})
		.attr("cy", function (d) {
			return y(d.life_exp)
		})
		.attr("r", function (d) { return Math.sqrt(area(d.population) / Math.PI) })


}