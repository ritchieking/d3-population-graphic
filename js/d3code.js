d3.json("data/worldPop.json",function(data){
	blob = data;

	// Line chart of oldest and youngest age groups

	lineBlob = blob.filter(function(d){return d.ageGroup == "age_0_19" || d.ageGroup == "age_60_plus"})
	var lineMargin = {top: 10, right: 50, bottom: 30, left: 40},
		lineWidth = 400 - lineMargin.right - lineMargin.left,
		lineHeight = 250 - lineMargin.top - lineMargin.bottom;

	lineScaleX = d3.scale.linear()
		.domain([
			d3.min(lineBlob, function(d,i){return d.year}),
			d3.max(lineBlob, function(d,i){return d.year})
			])
		.range([0, lineWidth]);

	lineScaleY = d3.scale.linear()
		.domain([0,0.5])
		.range([lineHeight,0])

	lineAxisX = d3.svg.axis()
		.scale(lineScaleX)
		.orient("bottom")
		.ticks(6)
		.tickFormat(d3.format(""))

	lineAxisY = d3.svg.axis()
		.scale(lineScaleY)
		.orient("left")
		.tickFormat(d3.format("%"))

	lineHelper = d3.svg.line()
		.x(function(d,i){return lineScaleX(d.year)})
		.y(function(d,i){return lineScaleY(d.percentage)})

	lineSVG = d3.select("#line-chart").append("svg")
		.attr("width", lineWidth + lineMargin.left + lineMargin.right)
		.attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
		.append("g")
		.attr("transform", "translate(" + lineMargin.left + "," + lineMargin.top + ")");

	lineSVG.append("g")
		.call(lineAxisY)
		.attr("class","axis")

	lineSVG.append("g")
		.call(lineAxisX)
		.attr("transform", "translate(0," + lineHeight + ")")
		.attr("class","axis")

	lineSVG.append("path")
		.datum(lineBlob.filter(function(d,i){return d.ageGroup == "age_60_plus"}))
		.attr("class","line")
		.attr("d", lineHelper)

	lineSVG.append("path")
		.datum(lineBlob.filter(function(d,i){return d.ageGroup == "age_0_19"}))
		.attr("class","lineYoung")
		.attr("d", lineHelper)
	

	// Bar chart worldwide population composition

	// First step is to filter out for only the decadal years. We can do this by using the remainder operator - %. If you divide the year by 10 and the remainder is 0, then you know you have a decade.
	barBlob = blob.filter(function(d){ return d.year%10 == 0})

	// Then, take barBlob and create a nested version of it where the years are used as a hierarchical key. This will allow you to easily 
	barNest = d3.nest().key(function(d){return d.year}).entries(barBlob)

	// Start with 1950 selected
	selected = "1950";

	var barMargin = {top: 30, right: 20, bottom: 0, left: 0},
    	width = 400 - barMargin.left - barMargin.right,
    	height = 250 - barMargin.top - barMargin.bottom,
		font = 13,
		chartmargin = 100,
		barHeight = (height-4)/4;

	barScale = d3.scale.linear()
		.domain([
			0,
			d3.max(barBlob, function(d,i){return d.percentage})
			])
		.range([
			chartmargin,
			width
			]);

	barAxis = d3.svg.axis()
		.scale(barScale)
		.orient("top")
		.ticks(4)
		.tickFormat(d3.format("%"))


	barSVG = d3.select("#bar-chart").append("svg")
	    .attr("width", width + barMargin.left + barMargin.right)
	    .attr("height", height + barMargin.top + barMargin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");
		
	barSVG.append("g")
		.attr("class","x axis")
		.call(barAxis)

	years = barSVG.append("g").selectAll("text")
		.data(barNest)
		.enter()
		.append("text")
			.attr("style","cursor:pointer")
			.attr("x",0)
			.attr("y",function(d,i){
				return i*20+font
			})
			.text(function(d){
				return d.key
			})
			.attr("font-size",function(d,i){
				if (d.key == selected) {
					return "18px"
				}
				else {
					return "13px"
				}
			})
			.on("click",function(d,i){
				selected = d.key;
				bars.data(barBlob.filter(function(d){ return d.year == selected})).enter()

				bars.transition()
					.duration(500)
					.attr("width",function(d,i){
						return barScale(d.percentage) - barScale(0)
					})

				years.transition()
					.duration(500)
					.attr("font-size",function(d,i){
						if (d.key == selected) {
							return "18px"
						}
						else {
							return "13px"
						}
					})
			})

	bars = barSVG.selectAll("rect")
		.data(barBlob.filter(function(d){ return d.year == selected}))
		.enter()
		.append("rect")
		.attr("fill",function(d,i){
			if (i===0) {
				return "magenta"
			}
			else {
				return "darkmagenta"
			}
		})
		.attr("x",barScale(0))
		.attr("y",function(d,i){
			return (barHeight+1)*i
		})
		.attr("height",barHeight)
		.attr("width",function(d,i){
			return barScale(d.percentage) - barScale(0)
		})

})

