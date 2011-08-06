(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addFilter/addFilters',
			description : 'addFilter, addFilters method test.',
			fn: function(){

				var filter1 = {
					foucs: function(content){}
				};

				var myPresen1 = new Presentation('container');
				myPresen1.addFilter(filter1);

				log( (myPresen1.hasFilter(filter1)) ? 'assert ok' : 'filter is not found.' );

				var filter2 = {
					foucs: function(content){}
				};
				var filter3 = {
					foucs: function(content){}
				};

				var myPresen2 = new Presentation('container');
				myPresen2.addFilters([filter2, filter3]);

				log( (myPresen2.hasFilter(filter2)) ? 'assert ok' : 'Filter2 is not found.' );
				log( (myPresen2.hasFilter(filter3)) ? 'assert ok' : 'Filter3 is not found.' );
			}
		});

		testcases.push({
			title: 'removeFilter/removeFilters',
			description : 'removeFilter, removeFilters method test.',
			fn: function(){

				var filter1 = {
					foucs: function(content){}
				};

				var myPresen1 = new Presentation('container');
				myPresen1.addFilter(filter1);
				myPresen1.removeFilter(filter1);

				log( (!myPresen1.hasFilter(filter1)) ? 'assert ok' : 'filter is found.');

				var filter2 = {
					foucs: function(content){}
				};
				var filter3 = {
					foucs: function(content){}
				};

				var myPresen2 = new Presentation('container');
				myPresen2.addFilters([ filter2, filter3 ]);

				myPresen2.removeFilters([ filter2, filter3 ]);

				log( (!myPresen2.hasFilter(filter2)) ? 'assert ok' : 'Filter2 is found.' );
				log( (!myPresen2.hasFilter(filter3)) ? 'assert ok' : 'Filter3 is found.' );
			}
		});

		testcases.push({
			title: 'applyFilter',
			description : 'applyFilter method test.',
			fn: function(){
				var filter1 = {
					foucs: function(content){
						var section = $(content);
						section.setStyle('background-color', '#cccccc');
					}
				};

				var myPresen = new Presentation('container');
				var content = myPresen.getContent(0);
				myPresen.addFilter(filter1);
				myPresen.applyFilter('foucs', content);
			}
		});



		testcases.push({
			title: 'filter options',
			description : 'filter options test.',
			fn: function(){
				var blur = false;
				var foucs = false;

				var bfilter = {
					blur: function(content){
						blur = true;
					}
				};
				var ffilter = {
					foucs: function(content){
						foucs = true;
					}
				};

				var myPresen = new Presentation('container', {
					filters: [bfilter, ffilter]
				});

				var content = myPresen.getContent(0);

				myPresen.applyFilter('blur', content);
				myPresen.applyFilter('foucs', content);

				log ( (blur && foucs) ? 'assert ok' : 'filter is not found.' );
			}
		});

		makeActions(testcases);

	}, false);

}(document));