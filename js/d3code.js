d3.json("data/worldPop.json",function(data){
	blob = data;

	// Bar chart worldwide population composition

	// First step is to filter out for only the decadal years. We can do this by using the remainder operator - %. If you divide the year by 10 and the remainder is 0, then you know you have a decade.
	barBlob = data.filter(function(d){ return d.year%10 == 0})

	// Then, take barBlob and create a nested version of it where the years are used as a hierarchical key. This will allow you to easily 
	barNest = d3.nest().key(function(d){return d.year}).entries(barBlob)

	// Start with 1950 selected
	selected = "1950";

	var margin = {top: 30, right: 20, bottom: 0, left: 0},
    	width = 400 - margin.left - margin.right,
    	height = 250 - margin.top - margin.bottom,
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
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
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

