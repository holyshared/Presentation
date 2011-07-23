(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addBeforeFilter/addBeforeFilters',
			description : 'addBeforeFilter, addBeforeFilters method test.',
			fn: function(){
				var filter1 = function(content){};

				var myPresen1 = new Presentation('container');
				myPresen1.addBeforeFilter(filter1);

				log( (myPresen1.hasBeforeFilter()) ? 'assert ok' : 'Before is not found.' );

				var filter2 = function(content){};
				var filter3 = function(content){};

				var myPresen2 = new Presentation('container');
				myPresen2.addBeforeFilters(filter2, filter3);

				log( (myPresen2.hasBeforeFilter()) ? 'assert ok' : 'Before filter is not found.' );
			}
		});

		testcases.push({
			title: 'removeBeforeFilter/removeBeforeFilters',
			description : 'removeBeforeFilter, removeBeforeFilters method test.',
			fn: function(){
				var filter1 = function(content){};

				var myPresen1 = new Presentation('container');
				myPresen1.addBeforeFilter(filter1);
				myPresen1.removeBeforeFilter(filter1);

				log( (!myPresen1.hasBeforeFilter()) ? 'assert ok' : 'Before is found.' );

				var filter2 = function(content){};
				var filter3 = function(content){};

				var myPresen2 = new Presentation('container');
				myPresen2.addBeforeFilters(filter2, filter3);
				myPresen2.removeBeforeFilters();

				log( (!myPresen2.hasBeforeFilter()) ? 'assert ok' : 'Before filter is found.' );
			}
		});

		makeActions(testcases);

	}, false);

}(document));