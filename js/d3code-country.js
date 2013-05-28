d3.json("data/countryPop.json",function(data){
	countryBlob = data;

	countryNest = d3.nest().key(function(d){return d.country}).entries(countryBlob)
	ageNest = d3.nest().key(function(d){return d.ageGroup}).entries(countryBlob)

	var countryMargin = {top: 30, right: 0, bottom: 10, left: 40},
		countryWidth = 900 - countryMargin.right - countryMargin.left,
		countryHeight = 550 - countryMargin.top - countryMargin.bottom;

	countryScaleX = d3.scale.ordinal()
		.domain(ageNest.map(function(d){return d.key}))
		.rangeRoundBands([0, countryWidth],0)

	countryScaleY = d3.scale.linear()
		.domain([0,0.6])
		.range([countryHeight,0])

	countryAxisX = d3.svg.axis()
		.scale(countryScaleX)
		.orient("top")

	countryAxisY = d3.svg.axis()
		.scale(countryScaleY)
		.orient("left")
		.ticks(5)
		.tickFormat(d3.format("%"))

	countryLineHelper = d3.svg.line()
		.x(function(d,i){return countryScaleX(d.ageGroup)})
		.y(function(d,i){return countryScaleY(d.percentage)})

	countrySVG = d3.select("#country-chart").append("svg")
		.attr("width",countryWidth + countryMargin.right + countryMargin.left)
		.attr("height",countryHeight + countryMargin.top + countryMargin.bottom)
		.append("g")
		.attr("transform","translate(" + countryMargin.left + "," + countryMargin.top + ")")

	countrySVG.append("g")
		.call(countryAxisY)
		.attr("class","axis")

	countrySVG.append("g")
		.call(countryAxisY)
		.attr("class","secondary axis")
		.attr("transform","translate(" + countryScaleX.rangeBand() + ",0)")

	countrySVG.append("g")
		.call(countryAxisY)
		.attr("class","secondary axis")
		.attr("transform","translate(" + 2*countryScaleX.rangeBand() + ",0)")

	countrySVG.append("g")
		.call(countryAxisY)
		.attr("class","secondary axis")
		.attr("transform","translate(" + 3*countryScaleX.rangeBand() + ",0)")

	countrySVG.append("g")
		.call(countryAxisX)
		.attr("transform", "translate(" + (-countryScaleX.rangeBand()/2) + ",0)")
		.attr("class","x axis no-ticks")

	label = countrySVG.append("text")
		.attr("class","selected-line-text")
		.attr("x",2*countryScaleX.rangeBand()+20)
		.attr("y",countryHeight/3)
		.text("")

	for (var i = 0; i <= countryNest.length - 1; i++) {
		temp = countrySVG.append("path")
			.datum(countryNest[i].values)
			.attr("class","country-line")
			.attr("d",countryLineHelper)
			.on("mouseover", function(d){
				d3.select(this).attr("class","selected-line")
				label.text(d[0].country)

			})
			.on("mouseout",function(d){
				d3.select(this).attr("class","country-line")
				label.text("")
			})
	};
	
})