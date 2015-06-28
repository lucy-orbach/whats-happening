$(document).ready(function(){
    showElement( $('.banner') );
    $('.banner').click(introAnimation);

  //   var waypoint = new Waypoint({
  // 	element: document.getElementById('nChart'),
  // 	handler: function() {
  //   alert('Basic waypoint triggered');
  // }
	//})

});//document ready



//================================
//    INTO ANIMATION
//================================
function showElement(element) {
    element.hide().delay( 400 ).fadeIn('slow');
}
function hideElement(element) {
    element.delay( 400 ).fadeOut('slow');
}

function introAnimation (){
    $('.pic').addClass('out');

    setTimeout( hideElement($('.banner')), 800);
    setTimeout( hideElement($('.wrapper')), 1600);
    hoodSection = '#nChart';
    hLink = '/neighborhoods/';
    catSection = '#catChart';
    cLink = '/categories/';
    hChart(gon.neighborhoods, hoodSection, hLink );
    hChart(gon.categories, catSection, cLink );
    sunChart();
  	
}

//================================
//    d3
//================================


function hChart (chartType, section, linkRoot) {
	var data = chartType;

	var canvas = d3.select(section).append('svg')
		.attr('width', 1100)
		.attr('height', 750);

	var color = d3.scale.linear()
    	.domain([0, 17])
    	.range(['#E50099', '#E50026', '#E54D00', '#E50099'	]);

	canvas.selectAll('rect')
		.data(data)
		.enter()
			.append('a')
			.attr('xlink:href', function(d){return linkRoot+d.id;})
			.append('rect')
			.attr('width', 1)
			.attr('height', 30)
			.attr('y', function(d, i){ return i * 50;})
			.attr('fill', function(d, i){ return color(i); })
			.transition()
			.delay(1000)
			.duration(2000)
			.attr('width', function(d){ return d.count * 10; });
		 

	canvas.selectAll('text')
		.data(data)
		.enter()
			.append('a')
			.attr('xlink:href', function(d){return linkRoot+d.id;})
			.append('text')
			.text(function(d){return d.name; })
			.attr('fill', '#ffffff')
			.attr('y', function(d, i){ return i * 50  + 20;} );
			
};

function sunChart(){
	var width = 960,
    	height = 700,
    	radius = Math.min(width, height) / 2,
    	color = d3.scale.category20c();

	var svg = d3.select("#sunChart").append("svg")
    	.attr("width", width)
    	.attr("height", height)
  		.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

	var partition = d3.layout.partition()
    	.sort(null)
    	.size([2 * Math.PI, radius * radius])
    	.value(function(d) { return 1; });

	var arc = d3.svg.arc()
	    .startAngle(function(d) { return d.x; })
	    .endAngle(function(d) { return d.x + d.dx; })
	    .innerRadius(function(d) { return Math.sqrt(d.y); })
	    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

	

	var path = svg.datum(gon.flare).selectAll("path")
	    .data(partition.nodes)
	    .enter().append("path")
	    .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	    .attr("d", arc)
	    .style("stroke", "#fff")
	    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
	    .style("fill-rule", "evenodd")
	    .each(stash);


	// Stash the old values for transition.
	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	// Interpolate the arcs in data space.
	function arcTween(a) {
	  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  return function(t) {
	    var b = i(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  };
	}

	d3.select(self.frameElement).style("height", height + "px");

}


