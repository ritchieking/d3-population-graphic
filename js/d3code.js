d3.json("data/worldPop.json",function(data){
	blob = data;
	nest = d3.nest().key(function(d){return d.year}).entries(blob)

	selected = "1950";

	var width = 500,
		height = 500,
		font = 13,
		chartmargin = 100,
		barHeight = 50;

	svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height",height)

	years = svg.selectAll("text")
		.data(nest)
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
				bars.data(blob.filter(function(d){ return d.year == selected})).enter()

				bars.transition()
					.duration(500)
					.attr("width",function(d,i){
						return d.percentage*600
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

	bars = svg.selectAll("rect")
		.data(blob.filter(function(d){ return d.year == selected}))
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
		.attr("x",chartmargin)
		.attr("y",function(d,i){
			return (barHeight+1)*i
		})
		.attr("height",barHeight)
		.attr("width",function(d,i){
			return d.percentage*600
		})
})

