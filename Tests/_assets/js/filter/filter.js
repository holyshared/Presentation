(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addFilter/addFilters',
			description : 'addFilter, addFilters method test.',
			fn: function(){

				var filter1 = {
					activate: function(content){}
				};

				var myPresen1 = new Presentation('presentation');
				myPresen1.start();

				myPresen1.addFilter(filter1);

				log( (myPresen1.hasFilter(filter1)) ? 'assert ok' : 'filter is not found.' );

				var filter2 = {
					activate: function(content){}
				};
				var filter3 = {
					activate: function(content){}
				};

				var myPresen2 = new Presentation('presentation');
				myPresen2.start();

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
					activate: function(content){}
				};

				var myPresen1 = new Presentation('presentation');
				myPresen1.start();

				myPresen1.addFilter(filter1);
				myPresen1.removeFilter(filter1);

				log( (!myPresen1.hasFilter(filter1)) ? 'assert ok' : 'filter is found.');

				var filter2 = {
					activate: function(content){}
				};
				var filter3 = {
					activate: function(content){}
				};

				var myPresen2 = new Presentation('presentation');
				myPresen2.start();

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
					activate: function(content){
						var section = $(content);
						section.setStyle('background-color', '#000000');
					}
				};

				var myPresen = new Presentation('presentation');
				myPresen.start();

				var content = myPresen.getContent(0);
				myPresen.addFilter(filter1);
				myPresen.applyFilter('activate', content);
			}
		});

		makeActions(testcases);

	}, false);

}(document));