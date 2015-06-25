$(document).ready(function(){
    showElement( $('.banner') );
    $('.banner').click(introAnimation);

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

  
}

//================================
//    d3
//================================


$(function horizontalChart () {
	var data = gon.neighborhoods;

	var canvas = d3.select('#nChart').append('svg')
		.attr('width', 1100)
		.attr('height', 750)
;

	var color = d3.scale.linear()
    	.domain([0, 16])
    	.range(['#E50099', '#E50026', '#E54D00', '#E50099'	]);

	

	canvas.selectAll('rect')
		.data(data)
		.enter()
			.append('rect')
			.attr('width', function(d){ return d.events * 10; })
			.attr('height', 30)
			.attr('y', function(d, i){ return i * 50;})
			.attr('fill', function(d, i){ return color(i); });
			//.append('g');

	// bars.transiton()
	// 	.delay(5000)
	// 	.duration(1000)
	// 	.attr('width', function(d){ return d.events * 10; });

    			 

	canvas.selectAll('text')
		.data(data)
		.enter()
			.append('text')
			.attr('fill', '#ffffff')
			.attr('y', function(d, i){ return i * 50  + 20;} )
			.text(function(d){return d.name; });
})();


