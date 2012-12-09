var browser = BrowserDetect;

var buckets = 11,
	colorScheme = 'rbow2',
	days = [
		{ name: 'Monday', abbr: 'Mo' },
		{ name: 'Tuesday', abbr: 'Tu' },
		{ name: 'Wednesday', abbr: 'We' },
		{ name: 'Thursday', abbr: 'Th' },
		{ name: 'Friday', abbr: 'Fr' },
		{ name: 'Saturday', abbr: 'Sa' },
		{ name: 'Sunday', abbr: 'Su' }
	],
	hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];


/* ************************** */
d3.json('tru247.json', function(json) {
	
	data = json;

	createTiles();
	reColorTiles('all', 'all');
	
	
	/* ************************** */
	
	// All, PC, Mobile control event listener
	$('input[name="type"]').change(function() {
		
		var type = $(this).val(),
			$sel = d3.select('#map path.state.sel');
		
		d3.selectAll('fieldset#type label').classed('sel', false);
		d3.select('label[for="type_' + type + '"]').classed('sel', true);
		
		if ($sel.empty()) {
			var state = 'all';
		} else {
			var state = $sel.attr('id');
		}
		
		reColorTiles(state, type);
		d3.select('#pc2mob').attr('class', type);
	});
	
	/* ************************** */
	
	// All States click
	$('label[for="state_all"]').click(function() {
		
		d3.selectAll('fieldset#state label').classed('sel', false);
		$(this).addClass('sel');
		var type = d3.select('input[name="type"]').property('value');
		
		d3.selectAll('#map path.state').classed('sel', false);
		
		reColorTiles('all', type);
		//drawMobilePie('all');
		
		d3.select('#wtf h2').html('All States');
	});
	
	/* ************************** */
	
	// Text States list event listener
	$('input[name="state"]').change(function() {
		
		var state = $(this).val(),
			type = d3.select('input[name="type"]').property('value');
		
		d3.selectAll('fieldset#state label').classed('sel', false);
		d3.select('label[for="state_' + state + '"]').classed('sel', true);
		
		reColorTiles(state, type);
		updateIE8percents(state);
	});

	/* ************************** */
	
	// tiles mouseover events
	$('#tiles td').hover(function() {
	
		$(this).addClass('sel');
		
		var tmp = $(this).attr('id').split('d').join('').split('h'),
			day = parseInt(tmp[0]),
			hour = parseInt(tmp[1]);
		
		var $sel = d3.select('#map path.state.sel');
		
		if ($sel.empty()) {
			var state = 'all';
		} else {
			var state = $sel.attr('id');
		}
		
		var view = 'all';

	}, function() {
		
		$(this).removeClass('sel');
		
		var $sel = d3.select('#map path.state.sel');
		
		if ($sel.empty()) {
			var state = 'all';
		} else {
			var state = $sel.attr('id');
		}
	});
});

/* ************************** */

function reColorTiles(state, view) {
	
	var calcs = getCalcs(state, view),
		range = [];
	
	for (var i = 1; i <= buckets; i++) {
		range.push(i);
	}
	
	var bucket = d3.scale.quantize().domain([0, calcs.max > 0 ? calcs.max : 1]).range(range),
		side = d3.select('#tiles').attr('class');
	
	
	if (side === 'front') {
		side = 'back';
	} else {
		side = 'front';
	}
	
	for (var d = 0; d < data[state].views.length; d++) {
		for (var h = 0; h < data[state].views[d].length; h++) {

			var sel = '#d' + d + 'h' + h + ' .tile .' + side,
				val = data[state].views[d][h].pc + data[state].views[d][h].mob;
			
			if (view !== 'all') {
				val = data[state].views[d][h][view];
			}
			
			// erase all previous bucket designations on this cell
			for (var i = 1; i <= buckets; i++) {
				var cls = 'q' + i + '-' + buckets;
				d3.select(sel).classed(cls , false);
			}
			
			// set new bucket designation for this cell
			var cls = 'q' + (val > 0 ? bucket(val) : 0) + '-' + buckets;
			d3.select(sel).classed(cls, true);
		}
	}
	flipTiles();
}


/* ************************** */

//Inspired By: http://trends.truliablog.com/vis/tru247/
function flipTiles() {

	var oldSide = d3.select('#tiles').attr('class'),
		newSide = '';
	
	if (oldSide == 'front') {
		newSide = 'back';
	} else {
		newSide = 'front';
	}
	
	var flipper = function(h, d, side) {
		return function() {
			var sel = '#d' + d + 'h' + h + ' .tile',
				rotateY = 'rotateY(180deg)';
			
			if (side === 'back') {
				rotateY = 'rotateY(0deg)';	
			}
			if (browser.browser === 'Safari' || browser.browser === 'Chrome') {
				d3.select(sel).style('-webkit-transform', rotateY);
			} else {
				d3.select(sel).select('.' + oldSide).classed('hidden', true);
				d3.select(sel).select('.' + newSide).classed('hidden', false);
			}
				
		};
	};
	
	for (var h = 0; h < hours.length; h++) {
		for (var d = 0; d < days.length; d++) {
			var side = d3.select('#tiles').attr('class');
			setTimeout(flipper(h, d, side), (h * 20) + (d * 20) + (Math.random() * 100));
		}
	}
	d3.select('#tiles').attr('class', newSide);
}


/* ************************** */


function createTiles() {

	var html = '<table id="tiles" class="front">';

	html += '<tr><th><div>&nbsp;</div></th>';

	for (var h = 0; h < hours.length; h++) {
		html += '<th class="h' + h + '">' + hours[h] + '</th>';
	}
	
	html += '</tr>';

	for (var d = 0; d < days.length; d++) {
		html += '<tr class="d' + d + '">';
		html += '<th>' + days[d].abbr + '</th>';
		for (var h = 0; h < hours.length; h++) {
			html += '<td id="d' + d + 'h' + h + '" class="d' + d + ' h' + h + '"><div class="tile"><div class="face front"></div><div class="face back"></div></div></td>';
		}
		html += '</tr>';
	}
	
	html += '</table>';
	d3.select('#chart').html(html);
}

/* ************************** */

function getCalcs(state, view) {
	
	var min = 1,
		max = -1;
	
	// calculate min + max
	for (var d = 0; d < data[state].views.length; d++) {
		for (var h = 0; h < data[state].views[d].length; h++) {
			
			if (view === 'all') {
				var tot = data[state].views[d][h].pc + data[state].views[d][h].mob;
			} else {
				var tot = data[state].views[d][h][view];
			}
			
			if (tot > max) {
				max = tot;
			}
			
			if (tot < min) {
				min = tot;
			}
		}
	}
	
	return {'min': min, 'max': max};
};
