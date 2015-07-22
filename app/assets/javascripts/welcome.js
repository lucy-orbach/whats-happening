'use strict'
$(document).ready(function(){
    showElement( $('.banner') );
    $('.banner').click(introAnimation);
    slideMYdiv ( $('#nLink'), $('.neighborhoods'), $('#cLink'), $('.categories') )
    slideMYdiv ( $('#cLink'), $('.categories'), $('#nLink'), $('.neighborhoods') )
    $("#meLink").click(function(){
      $('.neighborhoods').removeClass('slide-in').addClass('slide-out');
      $('.categories').removeClass('slide-in').addClass('slide-out');
    });

  

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
    // var hoodSection = '#nChart';
    // var hLink = '/neighborhoods/';
    // var catSection = '#catChart';
    // var cLink = '/categories/';
    // hChart(gon.neighborhoods, hoodSection, hLink );
    // hChart(gon.categories, catSection, cLink );
    sunChart();
  	
}

//================================
//     slideMYdiv 
//================================
// slides back and forth divs inside a visible area


function slideMYdiv ( linkToslideA, slideA, linkToslideB, slideB, gonData, chartSection, link  ) {
  linkToslideA.click( function() {
    linkToslideA.toggleClass('active');
    linkToslideB.toggleClass('active');
    slideA.removeClass('slide-out').addClass('slide-in');
    slideB.removeClass('slide-in').addClass('slide-out');
    var hoodSection = '#nChart';
    var hLink = '/neighborhoods/';
    var catSection = '#catChart';
    var cLink = '/categories/';
    hChart(gon.neighborhoods, hoodSection, hLink );
    hChart(gon.categories, catSection, cLink );
  }); 
};



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
	// Dimensions of sunburst.
	var width = 750;
	var height = 600;
	var radius = (Math.min(width, height) / 2)-25;

	// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
	var b = {
  	w: 75, h: 30, s: 3, t: 10
	};

	// Mapping of colors.
	var colors = ['#E50099', '#E50026', '#E54D00', '#CE0089','#B7007A','#A0006B','#ec149c', '#e214ad', '#d714ab', '#f71492', '#e7148a', '#e01492', '#eb14a3','#e54d00', '#fc5500', '#ff6314', '#ff722b','#e5005f','#e5004c','#e50039','#e50026','#e50013','#e50000','#e51300'];
	

	// Total size of all segments; we set this later, after loading the data.
	var totalSize = 0; 

	var vis = d3.select("#sunChart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "chartContainer")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var partition = d3.layout.partition()
	    .size([2 * Math.PI, radius * radius])
	    .value(function(d) { return d.size; });

	var arc = d3.svg.arc()
	    .startAngle(function(d) { return d.x; })
	    .endAngle(function(d) { return d.x + d.dx; })
	    .innerRadius(function(d) { return Math.sqrt(d.y); })
	    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  createVisualization(gon.flare);

	// Main function to draw and set up the visualization, once we have the data.
	function createVisualization(json) {
	  // Basic setup of page elements.
	  	initializeBreadcrumbTrail();
	  	//drawLegend();
	  	//d3.select("#togglelegend").on("click", toggleLegend);

	  // Bounding circle underneath the sunburst, to make it easier to detect
	  // when the mouse leaves the parent g.
	  vis.append("svg:circle")
	      .attr("r", radius)
	      .style("opacity", 0);

	  // For efficiency, filter nodes to keep only those large enough to see.
	  var nodes = partition.nodes(json)
	      .filter(function(d) {
	      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
	      });

	  var path = vis.data([json]).selectAll("path")
	      .data(nodes)
	      .enter().append("svg:path")
	      .attr("display", function(d) { return d.depth ? null : "none"; })
	      .attr("d", arc)
	      .attr("fill-rule", "evenodd")
	      .style("fill", function(d) { return colors[Math.floor(Math.random() * colors.length)]; })
	      .style("opacity", 1)
	      .on("mouseover", mouseover);

    //get Total events for NYC
    var totalEvents = countEvents(json);
    displayLegend('NYC', totalEvents);
	  // Add the mouseleave handler to the bounding circle.
	  d3.select("#chartContainer").on("mouseleave", mouseleave);

	  // Get total size of the tree = value of root node from partition.
	  totalSize = path.node().__data__.value;

	};

  //get Total events for NYC
  function countEvents(json){
    var count = 0;
    var neighborhoods = json.children;

    for (var n=0; n<neighborhoods.length; n++) {
      var venues = neighborhoods[n].children;
      for (var v=0; v<venues.length; v++) {
        count += venues[v].children.length;
      }
    }
    return count
  }

  function displayLegend(location, quant){
    d3.select("#quant")
      .text(quant);

    d3.select("#location")
    .text(location);

    d3.select("#explanation")
      .style("visibility", "");
  }

	// Fade all but the current sequence, and show it in the breadcrumb trail.
	function mouseover(d) {
    if (d.depth === 3) {
      var event = d.name;
      d3.select("#eTxt")
      .text(event);
      d3.select(this).on("mouseleave", function(){

        d3.select("#eTxt")
          .html("<span id='quant' class='dynamic-txt bubble'></span>"+"Art Events in"+"<span id='location' class='dynamic-txt bubble'></span>");
      });
    } else {
      var location = d.name;
  		var venues = d.children.length
    	var quant = d.children.length
      displayLegend(location,quant);
    }

  	var sequenceArray = getAncestors(d);
  	// updateBreadcrumbs(sequenceArray, percentageString);

  	// Fade all the segments.
  	d3.selectAll("path")
      .style("opacity", 0.3);

  	// Then highlight only those that are an ancestor of the current segment.
  	vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
	}

	// Restore everything to full opacity when moving off the visualization.
	function mouseleave(d) {    
  // Hide the breadcrumb trail
  // d3.select("#trail")
  //     .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  displayLegend('NYC', 519);
  d3.select("#explanation")
      .transition()
      .duration(1000)
      //.style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
// function updateBreadcrumbs(nodeArray, percentageString) {

//   // Data join; key function combines name and depth (= position in sequence).
//   var g = d3.select("#trail")
//       .selectAll("g")
//       .data(nodeArray, function(d) { return d.name + d.depth; });

//   // Add breadcrumb and label for entering nodes.
//   var entering = g.enter().append("svg:g");

//   entering.append("svg:polygon")
//       .attr("points", breadcrumbPoints)
//       .style("fill", function(d) { return colors[d.name]; });

//   entering.append("svg:text")
//       .attr("x", (b.w + b.t) / 2)
//       .attr("y", b.h / 2)
//       .attr("dy", "0.35em")
//       .attr("text-anchor", "middle")
//       .text(function(d) { return d.name; });

//   // Set position for entering and updating nodes.
//   g.attr("transform", function(d, i) {
//     return "translate(" + i * (b.w + b.s) + ", 0)";
//   });

//   // Remove exiting nodes.
//   g.exit().remove();

//   // Now move and update the percentage at the end.
//   d3.select("#trail").select("#endlabel")
//       .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
//       .attr("y", b.h / 2)
//       .attr("dy", "0.35em")
//       .attr("text-anchor", "middle")
//       .text(percentageString);

//   // Make the breadcrumb trail visible, if it's hidden.
//   d3.select("#trail")
//       .style("visibility", "");

// }

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
}



